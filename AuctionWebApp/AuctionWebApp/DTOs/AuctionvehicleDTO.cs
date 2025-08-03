namespace AuctionWebApp.DTOs
{
  public class AuctionvehicleDTO
  {
    public string name { get; set; }
    public string description { get; set; }
    public decimal basePrice { get; set; }
    public string dateEnd { get; set; }
    //public string item { get; set; }  
    //public string? ImageFile { get; set; }
    public IFormFile? ImageFile { get; set; }
  }
}
