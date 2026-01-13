using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Aurora.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddInventoryValuationCosts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "UnitPrice",
                schema: "logistics",
                table: "StockMovements",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "AverageUnitCost",
                schema: "logistics",
                table: "StockLevels",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "UnitCost",
                schema: "logistics",
                table: "DeliveryItems",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UnitPrice",
                schema: "logistics",
                table: "StockMovements");

            migrationBuilder.DropColumn(
                name: "AverageUnitCost",
                schema: "logistics",
                table: "StockLevels");

            migrationBuilder.DropColumn(
                name: "UnitCost",
                schema: "logistics",
                table: "DeliveryItems");
        }
    }
}
