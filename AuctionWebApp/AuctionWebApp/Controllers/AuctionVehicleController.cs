using System.Data.Entity;
using System.Text.Json;
using AuctionWebApp.Data;
using AuctionWebApp.DTOs;
using AuctionWebApp.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AuctionWebApp.Controllers
{

  [Route("api/[controller]/[action]")]
  [ApiController]
  public class AuctionVehicleController : ControllerBase
  {
    private readonly DBContext dbContext;
    private readonly IWebHostEnvironment env;

    public AuctionVehicleController(DBContext dbContext, IWebHostEnvironment env)
    {
      this.dbContext = dbContext;
      this.env = env;
    }


    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult> getVechileList()
    {
      ResponseDto responseDto = new ResponseDto();
      responseDto.data =  dbContext.auctionVehicles.ToList();
      return Ok(responseDto);
    }
    
    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<ActionResult> getVechileDetial(string id)
    {
      ResponseDto responseDto = new ResponseDto();
      responseDto.data = dbContext.auctionVehicles.Where(x => x.id.Equals(id)).FirstOrDefault();
      return Ok(responseDto);
    }



    [Authorize]
    [HttpPost]
    public async Task<ActionResult> AddAuctionVechile([FromForm] AuctionvehicleDTO auctionVehicle)
    {
      ResponseDto responseDto = new ResponseDto();
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      try
      {

        if (auctionVehicle.ImageFile == null || auctionVehicle.ImageFile.Length < 0)
        {
          responseDto.isSuccess = false;
          responseDto.message = "Image is required";
          return BadRequest(responseDto);
        }

        var extension = Path.GetExtension(auctionVehicle.ImageFile.FileName);
        var sanitizedFileName = Guid.NewGuid().ToString() + extension;

        var subFolder = "AuctionVehicle";
        var storeFileDirectory = Path.Combine(env.WebRootPath, subFolder);

        if (!Directory.Exists(storeFileDirectory))
        {
          Directory.CreateDirectory(storeFileDirectory);
        }

        var savePath = Path.Combine(storeFileDirectory, sanitizedFileName);

        using (var stream = new FileStream(savePath, FileMode.Create))
        {
          await auctionVehicle.ImageFile.CopyToAsync(stream);
        }

        var fileLocation = $"{subFolder}/{sanitizedFileName}".Replace("\\", "/");


        string generatedItemCode = $"07661-{new Random().Next(100, 999)}";
        string uniqueId = $"ITM-{DateTime.UtcNow:yyMMdd}-{new Random().Next(1000, 9999)}";


        AuctionVehicle auction = new AuctionVehicle
        {
          name = auctionVehicle.name,
          description = auctionVehicle.description,
          basePrice = auctionVehicle.basePrice,
          item = generatedItemCode,
          itemId = uniqueId,
          images = "test",
          dateEnd  = auctionVehicle.dateEnd
        }; 
        dbContext.auctionVehicles.Add(auction);
       int result = await dbContext.SaveChangesAsync();
        if (result > 0)
        {
          responseDto.message = "Auction vehicle registered successfully.";
          responseDto.data = auction;
          return Ok(responseDto);
        }
        else
        {
          responseDto.isSuccess = false;
          responseDto.message = "Registration Failed";
          responseDto.data = "Unknown Errror Occured";
          return BadRequest(responseDto);
        }

      }
      catch (JsonException ex) {
        responseDto.isSuccess = false;
        responseDto.message = "An error occurred while registering the vehicle.";
        responseDto.data = ex; 
        return BadRequest(responseDto);
      }

    } 
  }
}
