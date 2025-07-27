using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity; 

namespace AuctionWebApp.Model
{
  public class User : IdentityUser
  {
    [PersonalData]
    [Column(TypeName = "nvarchar(150)")]
    public string FullName { get; set; } = "";

  }
}
