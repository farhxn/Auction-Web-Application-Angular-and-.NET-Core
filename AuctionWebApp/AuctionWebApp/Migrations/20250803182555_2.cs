using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AuctionWebApp.Migrations
{
    /// <inheritdoc />
    public partial class _2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.CreateTable(
                name: "auctionVehicles",
                columns: table => new
                {
                    id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    basePrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    dateEnd = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    item = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    itemId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    images = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    bitCount = table.Column<int>(type: "int", nullable: true),
                    createdAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    modifiedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    modifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_auctionVehicles", x => x.id);
                });


        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.DropTable(
                name: "auctionVehicles");
        }
    }
}
