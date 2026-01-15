using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Aurora.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddJournalEntryClearingFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "BusinessPartnerId",
                table: "JournalEntryLines",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ClearedAt",
                table: "JournalEntryLines",
                type: "timestamp without time zone",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ClearingId",
                table: "JournalEntryLines",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "JournalEntries",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_JournalEntryLines_BusinessPartnerId",
                table: "JournalEntryLines",
                column: "BusinessPartnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_JournalEntryLines_BusinessPartners_BusinessPartnerId",
                table: "JournalEntryLines",
                column: "BusinessPartnerId",
                principalSchema: "commercial",
                principalTable: "BusinessPartners",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_JournalEntryLines_BusinessPartners_BusinessPartnerId",
                table: "JournalEntryLines");

            migrationBuilder.DropIndex(
                name: "IX_JournalEntryLines_BusinessPartnerId",
                table: "JournalEntryLines");

            migrationBuilder.DropColumn(
                name: "BusinessPartnerId",
                table: "JournalEntryLines");

            migrationBuilder.DropColumn(
                name: "ClearedAt",
                table: "JournalEntryLines");

            migrationBuilder.DropColumn(
                name: "ClearingId",
                table: "JournalEntryLines");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "JournalEntries");
        }
    }
}
