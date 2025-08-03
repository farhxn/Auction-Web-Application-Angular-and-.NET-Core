namespace AuctionWebApp.Model
{
  public class BaseEntities
  {
    public DateTime? createdAt { get; set; } = DateTime.Now;
    public string? createdBy { get; set; } = "";
    public DateTime? modifiedAt { get; set; } = DateTime.Now;
    public string? modifiedBy { get; set; } = "";
  }
}
