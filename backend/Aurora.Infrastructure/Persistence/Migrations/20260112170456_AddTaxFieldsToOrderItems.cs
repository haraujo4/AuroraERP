using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Aurora.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddTaxFieldsToOrderItems : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Cfop",
                schema: "sales",
                table: "SalesOrderItems",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "CofinsRate",
                schema: "sales",
                table: "SalesOrderItems",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "CofinsValue",
                schema: "sales",
                table: "SalesOrderItems",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "IcmsRate",
                schema: "sales",
                table: "SalesOrderItems",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "IcmsValue",
                schema: "sales",
                table: "SalesOrderItems",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "IpiRate",
                schema: "sales",
                table: "SalesOrderItems",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "IpiValue",
                schema: "sales",
                table: "SalesOrderItems",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "PisRate",
                schema: "sales",
                table: "SalesOrderItems",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "PisValue",
                schema: "sales",
                table: "SalesOrderItems",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "TotalTaxValue",
                schema: "sales",
                table: "SalesOrderItems",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "Cfop",
                table: "PurchaseOrderItems",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "CofinsRate",
                table: "PurchaseOrderItems",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "CofinsValue",
                table: "PurchaseOrderItems",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "IcmsRate",
                table: "PurchaseOrderItems",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "IcmsValue",
                table: "PurchaseOrderItems",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "IpiRate",
                table: "PurchaseOrderItems",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "IpiValue",
                table: "PurchaseOrderItems",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "PisRate",
                table: "PurchaseOrderItems",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "PisValue",
                table: "PurchaseOrderItems",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "TotalTaxAmount",
                table: "PurchaseOrderItems",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Cfop",
                schema: "sales",
                table: "SalesOrderItems");

            migrationBuilder.DropColumn(
                name: "CofinsRate",
                schema: "sales",
                table: "SalesOrderItems");

            migrationBuilder.DropColumn(
                name: "CofinsValue",
                schema: "sales",
                table: "SalesOrderItems");

            migrationBuilder.DropColumn(
                name: "IcmsRate",
                schema: "sales",
                table: "SalesOrderItems");

            migrationBuilder.DropColumn(
                name: "IcmsValue",
                schema: "sales",
                table: "SalesOrderItems");

            migrationBuilder.DropColumn(
                name: "IpiRate",
                schema: "sales",
                table: "SalesOrderItems");

            migrationBuilder.DropColumn(
                name: "IpiValue",
                schema: "sales",
                table: "SalesOrderItems");

            migrationBuilder.DropColumn(
                name: "PisRate",
                schema: "sales",
                table: "SalesOrderItems");

            migrationBuilder.DropColumn(
                name: "PisValue",
                schema: "sales",
                table: "SalesOrderItems");

            migrationBuilder.DropColumn(
                name: "TotalTaxValue",
                schema: "sales",
                table: "SalesOrderItems");

            migrationBuilder.DropColumn(
                name: "Cfop",
                table: "PurchaseOrderItems");

            migrationBuilder.DropColumn(
                name: "CofinsRate",
                table: "PurchaseOrderItems");

            migrationBuilder.DropColumn(
                name: "CofinsValue",
                table: "PurchaseOrderItems");

            migrationBuilder.DropColumn(
                name: "IcmsRate",
                table: "PurchaseOrderItems");

            migrationBuilder.DropColumn(
                name: "IcmsValue",
                table: "PurchaseOrderItems");

            migrationBuilder.DropColumn(
                name: "IpiRate",
                table: "PurchaseOrderItems");

            migrationBuilder.DropColumn(
                name: "IpiValue",
                table: "PurchaseOrderItems");

            migrationBuilder.DropColumn(
                name: "PisRate",
                table: "PurchaseOrderItems");

            migrationBuilder.DropColumn(
                name: "PisValue",
                table: "PurchaseOrderItems");

            migrationBuilder.DropColumn(
                name: "TotalTaxAmount",
                table: "PurchaseOrderItems");
        }
    }
}
