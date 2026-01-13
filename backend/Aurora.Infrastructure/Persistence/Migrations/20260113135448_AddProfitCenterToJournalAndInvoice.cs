using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Aurora.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddProfitCenterToJournalAndInvoice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ProfitCenterId",
                table: "JournalEntryLines",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "CostCenterId",
                table: "InvoiceItems",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ProfitCenterId",
                table: "InvoiceItems",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_JournalEntryLines_ProfitCenterId",
                table: "JournalEntryLines",
                column: "ProfitCenterId");

            migrationBuilder.CreateIndex(
                name: "IX_InvoiceItems_CostCenterId",
                table: "InvoiceItems",
                column: "CostCenterId");

            migrationBuilder.CreateIndex(
                name: "IX_InvoiceItems_ProfitCenterId",
                table: "InvoiceItems",
                column: "ProfitCenterId");

            migrationBuilder.AddForeignKey(
                name: "FK_InvoiceItems_CentrosCusto_CostCenterId",
                table: "InvoiceItems",
                column: "CostCenterId",
                principalSchema: "organization",
                principalTable: "CentrosCusto",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_InvoiceItems_CentrosLucro_ProfitCenterId",
                table: "InvoiceItems",
                column: "ProfitCenterId",
                principalSchema: "organization",
                principalTable: "CentrosLucro",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_JournalEntryLines_CentrosLucro_ProfitCenterId",
                table: "JournalEntryLines",
                column: "ProfitCenterId",
                principalSchema: "organization",
                principalTable: "CentrosLucro",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InvoiceItems_CentrosCusto_CostCenterId",
                table: "InvoiceItems");

            migrationBuilder.DropForeignKey(
                name: "FK_InvoiceItems_CentrosLucro_ProfitCenterId",
                table: "InvoiceItems");

            migrationBuilder.DropForeignKey(
                name: "FK_JournalEntryLines_CentrosLucro_ProfitCenterId",
                table: "JournalEntryLines");

            migrationBuilder.DropIndex(
                name: "IX_JournalEntryLines_ProfitCenterId",
                table: "JournalEntryLines");

            migrationBuilder.DropIndex(
                name: "IX_InvoiceItems_CostCenterId",
                table: "InvoiceItems");

            migrationBuilder.DropIndex(
                name: "IX_InvoiceItems_ProfitCenterId",
                table: "InvoiceItems");

            migrationBuilder.DropColumn(
                name: "ProfitCenterId",
                table: "JournalEntryLines");

            migrationBuilder.DropColumn(
                name: "CostCenterId",
                table: "InvoiceItems");

            migrationBuilder.DropColumn(
                name: "ProfitCenterId",
                table: "InvoiceItems");
        }
    }
}
