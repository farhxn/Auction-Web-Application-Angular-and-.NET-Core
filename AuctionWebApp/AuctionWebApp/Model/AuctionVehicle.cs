using System.ComponentModel.DataAnnotations;

namespace AuctionWebApp.Model
{
  public class AuctionVehicle : BaseEntities
  {
    [Key]
    public string id { get; set; } = Guid.NewGuid().ToString();
    public string name { get; set; }
    public string description { get; set; }
    public decimal basePrice { get; set; }
    public string dateEnd { get; set; }
    public string item { get; set; }
    public string itemId { get; set; }
    public string images { get; set; }
    public int? bitCount { get; set; } =  0;
  }
}
