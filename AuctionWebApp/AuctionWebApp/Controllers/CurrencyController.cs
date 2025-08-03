using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AuctionWebApp.Controllers
{
  [Route("api/[controller]/[action]")]
  [ApiController]
  public class CurrencyController : ControllerBase
  {
    private readonly HttpClient _httpClient;

    public CurrencyController(HttpClient httpClient)
    {
      _httpClient = httpClient;
    }

    [HttpGet("rates")]
    [AllowAnonymous]
    public async Task<IActionResult> GetRates()
    {
      string accessKey = "33040d2288c1660ae44f3680";
      string url = $"https://v6.exchangerate-api.com/v6/{accessKey}/latest/USD";

      try
      {
        var response = await _httpClient.GetAsync(url);

        if (!response.IsSuccessStatusCode)
        {
          return StatusCode((int)response.StatusCode, $"Error fetching rates: {response.ReasonPhrase}");
        }

        var content = await response.Content.ReadAsStringAsync();

        return Content(content, "application/json");
      }
      catch (Exception ex)
      {
        return StatusCode(500, $"Internal server error: {ex.Message}");
      }
    }
  }
}
