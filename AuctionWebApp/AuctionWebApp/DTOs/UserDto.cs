using System.ComponentModel.DataAnnotations;

namespace AuctionWebApp.DTOs
{
  public class UserDto
  {

  }

  public class UserRegistrationModel
  {
    public string? Email { get; set; }
    public string? Password { get; set; }
    public string? FullName { get; set; }
    public string? Role { get; set; }
  }

  public class UserLoginModel
  {
    public string Email { get; set; }
    public string Password { get; set; }
  }

  public class UserExtensionModel
  {
    public string Email { get; set; }
  }

  public class ResetPasswordDto
  {
    [Required]
    public string UserId { get; set; }

    [Required]
    public string Token { get; set; }

    [Required]
    [StringLength(100, MinimumLength = 6)]
    public string NewPassword { get; set; }
  }

}
