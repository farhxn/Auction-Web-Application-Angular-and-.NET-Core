namespace AuctionWebApp.DTOs
{
  public class ResponseDto
  {
    public bool isSuccess { get; set; } = true;
    public string message { get; set; } = "Successful";

    public object data { get; set; }
  }
}
