using AuctionWebApp.Model;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AuctionWebApp.Data
{
  public class DBContext : IdentityDbContext
  {
    public DBContext(DbContextOptions<DBContext> options) : base(options)
    {

    }
    public DbSet<User> users { get; set; }

  }
}
