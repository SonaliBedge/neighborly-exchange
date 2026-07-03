using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NeighborlyExchange.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddLookingForToListing : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LookingFor",
                table: "SkillListings",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LookingFor",
                table: "SkillListings");
        }
    }
}
