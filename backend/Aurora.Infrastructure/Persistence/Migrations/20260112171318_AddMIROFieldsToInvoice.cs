using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Aurora.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddMIROFieldsToInvoice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "PurchaseOrderId",
                table: "Invoices",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "SalesOrderId",
                table: "Invoices",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Cfop",
                table: "InvoiceItems",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "CofinsRate",
                table: "InvoiceItems",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "CofinsValue",
                table: "InvoiceItems",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "IcmsRate",
                table: "InvoiceItems",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "IcmsValue",
                table: "InvoiceItems",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "IpiRate",
                table: "InvoiceItems",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "IpiValue",
                table: "InvoiceItems",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<Guid>(
                name: "MaterialId",
                table: "InvoiceItems",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "PisRate",
                table: "InvoiceItems",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "PisValue",
                table: "InvoiceItems",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PurchaseOrderId",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "SalesOrderId",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "Cfop",
                table: "InvoiceItems");

            migrationBuilder.DropColumn(
                name: "CofinsRate",
                table: "InvoiceItems");

            migrationBuilder.DropColumn(
                name: "CofinsValue",
                table: "InvoiceItems");

            migrationBuilder.DropColumn(
                name: "IcmsRate",
                table: "InvoiceItems");

            migrationBuilder.DropColumn(
                name: "IcmsValue",
                table: "InvoiceItems");

            migrationBuilder.DropColumn(
                name: "IpiRate",
                table: "InvoiceItems");

            migrationBuilder.DropColumn(
                name: "IpiValue",
                table: "InvoiceItems");

            migrationBuilder.DropColumn(
                name: "MaterialId",
                table: "InvoiceItems");

            migrationBuilder.DropColumn(
                name: "PisRate",
                table: "InvoiceItems");

            migrationBuilder.DropColumn(
                name: "PisValue",
                table: "InvoiceItems");
        }
    }
}
