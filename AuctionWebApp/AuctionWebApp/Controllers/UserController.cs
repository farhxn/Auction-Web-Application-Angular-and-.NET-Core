using System.Data.Entity;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using AuctionWebApp.Data;
using AuctionWebApp.DTOs;
using AuctionWebApp.Model;
using AuctionWebApp.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace AuctionWebApp.Controllers
{
  [Route("api/[controller]/[action]")]
  [ApiController]
  public class UserController : ControllerBase
  {
    private readonly DBContext dBContext;
    private readonly IConfiguration configuration;
    private readonly EmailService _emailService;
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<IdentityRole> roleManage;

    public UserController(DBContext dBContext, IConfiguration configuration, EmailService emailService, UserManager<User> userManager, RoleManager<IdentityRole> roleManage)
    {
      this.dBContext = dBContext;
      this.configuration = configuration;
      this._emailService = emailService;
      this._userManager = userManager;
      this.roleManage = roleManage;
    }


    [AllowAnonymous]
    [HttpPost]
    public async Task<ActionResult<ResponseDto>> Register(UserManager<User> userManager, UserRegistrationModel registrationModel)
    {
      ResponseDto responseDto = new ResponseDto();

      if (!await IsEmailValidAndNotDisposable(registrationModel.Email))
      {
        responseDto.isSuccess = false;
        responseDto.message = "Please use a valid, non-temporary email address.";
        return BadRequest(responseDto);
      }

      User user = new User()
      {
        UserName = registrationModel.Email,
        Email = registrationModel.Email,
        FullName = registrationModel.FullName
      };
      var result = await userManager.CreateAsync(user, registrationModel.Password);
      await userManager.AddToRoleAsync(user, registrationModel.Role ?? "user");

      if (!result.Succeeded)
      {
        responseDto.isSuccess = false;
        responseDto.message = "Error occured while saving data";
        responseDto.data = result;
        return BadRequest(responseDto);
      }

      UserExtensionModel userLoginModel = new UserExtensionModel()
      {
        Email = user.Email
      };
      await SendMail(userLoginModel, 1);

      responseDto.data = $"{user.FullName} your account has been created. Verification mail has been send";
      return Ok(responseDto);

    }

    [AllowAnonymous]
    [HttpPost]
    public async Task<ActionResult<ResponseDto>> Login(UserManager<User> userManager, UserLoginModel userLogin)
    {
      ResponseDto responseDto = new ResponseDto();

      var user = await userManager.FindByEmailAsync(userLogin.Email);

      if (user != null && await userManager.CheckPasswordAsync(user, userLogin.Password))
      {
        if (!user.EmailConfirmed)
        {
          UserExtensionModel userLoginModel = new UserExtensionModel()
          {
            Email = user.Email
          };
          await SendMail(userLoginModel, 1);

          responseDto.isSuccess = false;
          responseDto.message = "Email is not verified.Verification mail has been send";
          return BadRequest(responseDto);
        }

        var role = await userManager.GetRolesAsync(user);

        ClaimsIdentity claims = new ClaimsIdentity(new Claim[]
         {
         new Claim("userID",user.Id.ToString()),
         new Claim("userName",user.FullName.ToString()),
         new Claim(ClaimTypes.Role,role.First()),
         });

        var signInKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["AppSettings:JWTSecret"]!));
        var tokenDescriptor = new SecurityTokenDescriptor
        {
          Subject = claims,
          Expires = DateTime.UtcNow.AddDays(1),
          SigningCredentials = new SigningCredentials(signInKey, SecurityAlgorithms.HmacSha256)
        };

        var TokenHandler = new JwtSecurityTokenHandler();
        var securityToken = TokenHandler.CreateToken(tokenDescriptor);
        var token = TokenHandler.WriteToken(securityToken);

        responseDto.data = new
        { Token = token }; ;

        return Ok(responseDto);

      }
      else
      {
        responseDto.isSuccess = false;
        responseDto.message = "Incorrect Credentials";
        return BadRequest(responseDto);
      }

    }


    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> ConfirmEmail(string userId, string token)
    {
      ResponseDto responseDto = new ResponseDto();
      if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(token))
      {
        responseDto.isSuccess = false;
        responseDto.message = "Missing userId or token.";
        return BadRequest(responseDto);
      }

      var user = await _userManager.FindByIdAsync(userId);
      if (user == null)
      {
        responseDto.isSuccess = false;
        responseDto.message = "User not found.";
        return NotFound(responseDto);
      }

      var result = await _userManager.ConfirmEmailAsync(user, token);

      if (result.Succeeded)
      {
        var payload = new { user.Email, verified = true };
        var secret = "my-secret-key";
        var verifyToken = GenerateVerificationToken(payload, secret);

        var redirectUrl = $"http://localhost:4200/login?token={Uri.EscapeDataString(verifyToken)}";
        return Redirect(redirectUrl);

        //responseDto.data = "✅ Email confirmed successfully. You can now log in.";
        //return Ok(responseDto);
      }
      else
      {
        responseDto.isSuccess = false;
        responseDto.message = "❌ Email confirmation failed. Token might be invalid or expired.";
        return BadRequest(responseDto);
      }
    }

    [AllowAnonymous]
    [HttpPost]
    public async Task<ActionResult<ResponseDto>> ForgetPassword(UserManager<User> userManager, UserExtensionModel userLogin)
    {
      ResponseDto responseDto = new ResponseDto();

      var user = await userManager.FindByEmailAsync(userLogin.Email);

      if (user != null)
      {
        if (!user.EmailConfirmed)
        {
          UserExtensionModel userLoginModel = new UserExtensionModel()
          {
            Email = user.Email!
          };
          await SendMail(userLoginModel, 1);

          responseDto.isSuccess = false;
          responseDto.message = "Email is not verified.Verification mail has been send";
          return BadRequest(responseDto);
        }

        UserExtensionModel userExtensionModel = new UserExtensionModel()
        {
          Email = user.Email!
        };

        await SendMail(userExtensionModel, 2);
        responseDto.message = "Reset Link Send";
        return Ok(responseDto);
      }

      responseDto.message = "Account Not Found";
      return BadRequest(responseDto);
    }


    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> ResetPassword(ResetPasswordDto model)
    {
      ResponseDto responseDto = new ResponseDto();

      var user = await _userManager.FindByIdAsync(model.UserId);
      if (user == null)
      {
        responseDto.isSuccess = false;
        responseDto.message = "Link Expired";
        return BadRequest(responseDto);
      }

      var decodedToken = WebUtility.UrlDecode(model.Token);

      var result = await _userManager.ResetPasswordAsync(user, decodedToken, model.NewPassword);
      if (result.Succeeded)
      {
        responseDto.message = "✅ Password has been reset successfully.";
        return Ok(responseDto);
      }
      responseDto.message = "❌ Password reset failed.";
      responseDto.isSuccess = false;
      responseDto.data = result.Errors;
      return BadRequest(responseDto);
    }


    #region User

    [HttpGet]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> UserList()
    {
      ResponseDto responseDto = new ResponseDto();
      var usersWithRoles = (from user in dBContext.users
                            join userRole in dBContext.UserRoles on user.Id equals userRole.UserId
                            join role in dBContext.Roles on userRole.RoleId equals role.Id
                            select new
                            {
                              user.Id,
                              user.Email,
                              user.EmailConfirmed,
                              user.PhoneNumber,
                              user.PhoneNumberConfirmed,
                              user.FullName,
                              Role = role.Name
                            }).OrderByDescending(x => x.Id).ToList();

      responseDto.data = usersWithRoles;
      return Ok(responseDto);
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> UserDetail(string id)
    {
      var responseDto = new ResponseDto();

      var user = await dBContext.users.FindAsync(id);
      if (user == null)
      {
        responseDto.isSuccess = false;
        responseDto.message = "User not found";
        return NotFound(responseDto);
      }

      var userRoleResult =  (from userRole in dBContext.UserRoles
                            join role in dBContext.Roles on userRole.RoleId equals role.Id
                            where userRole.UserId == user.Id
                            select role.Name).FirstOrDefault();

      responseDto.isSuccess = true;
      responseDto.data = new
      {
        user.Id,
        user.Email,
        user.EmailConfirmed,
        user.PhoneNumber,
        user.PhoneNumberConfirmed,
        user.FullName,
        Role = userRoleResult
      };

      return Ok(responseDto);
    }



    [Authorize(Roles = "admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult<ResponseDto>> EditUser(string id, [FromBody] UserRegistrationModel model, [FromServices] UserManager<User> userManager)
    {
      var response = new ResponseDto();

      var user = await userManager.FindByIdAsync(id);
      if (user == null)
      {
        response.isSuccess = false;
        response.message = "User not found";
        return NotFound(response);
      }

      user.FullName = model.FullName ?? user.FullName;
      user.Email = model.Email ?? user.Email;
      user.UserName = model.Email ?? user.UserName;

      var updateResult = await userManager.UpdateAsync(user);
      if (!updateResult.Succeeded)
      {
        response.isSuccess = false;
        response.message = "Failed to update user details";
        response.data = updateResult.Errors;
        return BadRequest(response);
      }

      if (!string.IsNullOrEmpty(model.Role))
      {
        var currentRoles = await userManager.GetRolesAsync(user);

        if (currentRoles.Any())
        {
          var removeResult = await userManager.RemoveFromRolesAsync(user, currentRoles);
          if (!removeResult.Succeeded)
          {
            response.isSuccess = false;
            response.message = "Failed to remove existing roles";
            response.data = removeResult.Errors;
            return BadRequest(response);
          }
        }

        var addResult = await userManager.AddToRoleAsync(user, model.Role);
        if (!addResult.Succeeded)
        {
          response.isSuccess = false;
          response.message = "Failed to assign new role";
          response.data = addResult.Errors;
          return BadRequest(response);
        }
      }


      if (!string.IsNullOrEmpty(model.Password))
      {
        var token = await userManager.GeneratePasswordResetTokenAsync(user);
        var passwordResult = await userManager.ResetPasswordAsync(user, token, model.Password);
        if (!passwordResult.Succeeded)
        {
          response.isSuccess = false;
          response.message = "Failed to update password";
          response.data = passwordResult.Errors;
          return BadRequest(response);
        }
      }

      response.isSuccess = true;
      response.message = "User updated successfully";
      return Ok(response);
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult<ResponseDto>> DeleteUser(string id, [FromServices] UserManager<User> userManager)
    {
      var response = new ResponseDto();

      var user = await userManager.FindByIdAsync(id);
      if (user == null)
      {
        response.isSuccess = false;
        response.message = "User not found";
        return NotFound(response);
      }

      var result = await userManager.DeleteAsync(user);
      if (!result.Succeeded)
      {
        response.isSuccess = false;
        response.message = "Failed to delete user";
        response.data = result.Errors;
        return BadRequest(response);
      }

      response.isSuccess = true;
      response.message = "User deleted successfully";
      return Ok(response);
    }


    #endregion


    #region Role
    [HttpGet]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> RoleList()
    {
      ResponseDto responseDto = new ResponseDto();
      responseDto.data = dBContext.Roles.Select(x=>new {x.Name,x.Id}).OrderByDescending(x => x.Id).ToList();
      return Ok(responseDto);
    }


    [HttpGet("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> RoleDetail(string id)
    {
      var responseDto = new ResponseDto();

      var user =  dBContext.Roles.Select(x => new { x.Name, x.Id }).Where(x => x.Id == id).FirstOrDefault();
      if (user == null)
      {
        responseDto.isSuccess = false;
        responseDto.message = "Role not found";
        return NotFound(responseDto);
      }
      responseDto.data = user;

      return Ok(responseDto);
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> AddRole(RoleDto roleDto)
    {
      ResponseDto responseDto = new ResponseDto();
      if (string.IsNullOrWhiteSpace(roleDto.name))
      {
        responseDto.isSuccess = false;
        responseDto.message = "Role name is required";
        return BadRequest(responseDto);
      }

      var roleExists = await roleManage.RoleExistsAsync(roleDto.name);
      if (roleExists)
      {
        responseDto.isSuccess = false;
        responseDto.message = "Role already exists";
        return BadRequest(responseDto);
      }

      var result = await roleManage.CreateAsync(new IdentityRole(roleDto.name));
      if (result.Succeeded)
      {
        responseDto.isSuccess = false;
        responseDto.message = "Role created successfully";
        return Ok(responseDto);
      }
      else
      {
        responseDto.isSuccess = false;
        responseDto.message = "Error while saving";
        responseDto.data = result.Errors;
        return BadRequest(responseDto);
      }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> EditRole(string id,  RoleDto roleDto)
    {
      ResponseDto responseDto = new ResponseDto();
      var role = await roleManage.FindByIdAsync(id);
      if (role == null)
      {
        responseDto.isSuccess = false;
        responseDto.message = "Role not found";
        return NotFound(responseDto);
      }

      if (!string.Equals(role.Name, roleDto.name, StringComparison.OrdinalIgnoreCase))
      {
        var exists = await roleManage.RoleExistsAsync(roleDto.name);
        if (exists)
        {
          responseDto.isSuccess = false;
          responseDto.message = "Role name already exists";
          return Conflict(responseDto);
        }
      }

      role.Name = roleDto.name;
      var result = await roleManage.UpdateAsync(role);

      if (result.Succeeded)
      {
        responseDto.isSuccess = true;
        responseDto.message = "Role updated successfully";
        return Ok(responseDto);
      }
      responseDto.isSuccess = false;
      responseDto.message = "Error while saving role name ";
      responseDto.data = result.Errors;
      return BadRequest(responseDto);
    }


    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> DeleteRole(string id)
    {
      ResponseDto responseDto = new ResponseDto();

      var role = await roleManage.FindByIdAsync(id);
      if (role == null)
      {
        responseDto.isSuccess = false;
        responseDto.message = "Role not found";
        return NotFound(responseDto);
      }

      var result = await roleManage.DeleteAsync(role);

      if (result.Succeeded)
      {
        responseDto.isSuccess = true;
        responseDto.message = "Role deleted successfully";
        return Ok(responseDto);
      }
      responseDto.isSuccess = false;
      responseDto.message = "Role not found";
      responseDto.data = result.Errors;
      return BadRequest(responseDto);
    }

    #endregion

    private async Task<bool> IsEmailValidAndNotDisposable(string email)
    {
      var apiKey = "efbf09fd75144c78a7657f985bc8ccf9";
      var url = $"https://emailvalidation.abstractapi.com/v1/?api_key={apiKey}&email={email}";

      using var httpClient = new HttpClient();
      var response = await httpClient.GetAsync(url);
      if (!response.IsSuccessStatusCode) return false;

      var content = await response.Content.ReadAsStringAsync();
      var result = JsonSerializer.Deserialize<EmailValidationResult>(content);

      return result != null &&
             result.deliverability == "DELIVERABLE" &&
             result.is_disposable_email?.value == false &&
             result.is_valid_format?.value == true &&
             result.is_smtp_valid?.value == true;

    }

    private async Task<ActionResult> SendMail(
        UserExtensionModel userLogin,
        int option)
    {
      string message = "", subject = "";

      var user = await _userManager.FindByEmailAsync(userLogin.Email);
      if (user == null)
        return NotFound("User not found.");

      switch (option)
      {
        case 1:
          var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
          var encodedToken = WebUtility.UrlEncode(token);
          var confirmationLink = $"https://localhost:7158/api/User/ConfirmEmail?userId={user.Id}&token={encodedToken}";

          subject = "Confirm Your Email – Welcome to Nilamex!";
          message = $@"
            <div style='font-family:Arial,sans-serif; color:#333; max-width:600px; margin:auto;'>
                <h2 style='color:#4CAF50;'>Welcome to Nilamex! 👋</h2>
                <p>We're excited to have you on board.</p>
                <p>Please confirm your email address to activate your account:</p>
                <a href='{confirmationLink}' style='
                    display:inline-block;
                    padding:12px 20px;
                    background-color:#4CAF50;
                    color:#fff;
                    text-decoration:none;
                    border-radius:6px;
                    font-weight:bold;'>Confirm Email</a>
                <p style='margin-top:30px;'>If you didn't create this account, you can safely ignore this message.</p>
                <p style='color:#999; font-size:12px;'>Thanks,<br/>The Nilamex Team</p>
            </div>";
          break;
        case 2:
          var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
          var encodedResetToken = WebUtility.UrlEncode(resetToken);
          var resetLink = $"http://localhost:4200/reset-password?userId={user.Id}&token={encodedResetToken}";

          subject = "Reset Your Password – Nilamex Support";
          message = $@"
        <div style='font-family:Arial,sans-serif; color:#333; max-width:600px; margin:auto;'>
            <h2 style='color:#f44336;'>Forgot Your Password? 🔒</h2>
            <p>No worries, it happens! Click the button below to reset your password:</p>
            <a href='{resetLink}' style='
                display:inline-block;
                padding:12px 20px;
                background-color:#f44336;
                color:#fff;
                text-decoration:none;
                border-radius:6px;
                font-weight:bold;'>Reset Password</a>
            <p style='margin-top:20px;'>If you didn’t request this, you can safely ignore this email.</p>
            <p style='color:#999; font-size:12px;'>Stay secure,<br/>The Nilamex Team</p>
        </div>";
          break;

        default:
          subject = "Testing";
          message = "<h1>Hello from ASP.NET Core</h1>";
          break;
      }

      await _emailService.SendEmailAsync(user.Email!, subject, message);
      return Ok("Email Sent");
    }

    private string GenerateVerificationToken(object data, string secret)
    {
      var json = JsonSerializer.Serialize(data);
      var key = Encoding.UTF8.GetBytes(secret);
      using var hmac = new HMACSHA256(key);
      var hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(json));
      return Convert.ToBase64String(hashBytes);
    }

  }
}
