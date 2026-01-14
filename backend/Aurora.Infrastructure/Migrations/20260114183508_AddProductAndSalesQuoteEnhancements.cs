using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Aurora.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddProductAndSalesQuoteEnhancements : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FreightType",
                schema: "sales",
                table: "SalesQuotes",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "PaymentCondition",
                schema: "sales",
                table: "SalesQuotes",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "IcmsRate",
                schema: "sales",
                table: "SalesQuoteItems",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "IcmsValue",
                schema: "sales",
                table: "SalesQuoteItems",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "IpiRate",
                schema: "sales",
                table: "SalesQuoteItems",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "IpiValue",
                schema: "sales",
                table: "SalesQuoteItems",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "DefaultIcmsRate",
                schema: "logistics",
                table: "Materials",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "DefaultIpiRate",
                schema: "logistics",
                table: "Materials",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "Origin",
                schema: "logistics",
                table: "Materials",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FreightType",
                schema: "sales",
                table: "SalesQuotes");

            migrationBuilder.DropColumn(
                name: "PaymentCondition",
                schema: "sales",
                table: "SalesQuotes");

            migrationBuilder.DropColumn(
                name: "IcmsRate",
                schema: "sales",
                table: "SalesQuoteItems");

            migrationBuilder.DropColumn(
                name: "IcmsValue",
                schema: "sales",
                table: "SalesQuoteItems");

            migrationBuilder.DropColumn(
                name: "IpiRate",
                schema: "sales",
                table: "SalesQuoteItems");

            migrationBuilder.DropColumn(
                name: "IpiValue",
                schema: "sales",
                table: "SalesQuoteItems");

            migrationBuilder.DropColumn(
                name: "DefaultIcmsRate",
                schema: "logistics",
                table: "Materials");

            migrationBuilder.DropColumn(
                name: "DefaultIpiRate",
                schema: "logistics",
                table: "Materials");

            migrationBuilder.DropColumn(
                name: "Origin",
                schema: "logistics",
                table: "Materials");
        }
    }
}
