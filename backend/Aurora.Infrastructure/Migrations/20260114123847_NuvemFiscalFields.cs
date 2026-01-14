using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Aurora.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class NuvemFiscalFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AuthorizationUrl",
                table: "FiscalDocuments",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ErrorMessage",
                table: "FiscalDocuments",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Protocol",
                table: "FiscalDocuments",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProviderReference",
                table: "FiscalDocuments",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "XmlUrl",
                table: "FiscalDocuments",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AuthorizationUrl",
                table: "FiscalDocuments");

            migrationBuilder.DropColumn(
                name: "ErrorMessage",
                table: "FiscalDocuments");

            migrationBuilder.DropColumn(
                name: "Protocol",
                table: "FiscalDocuments");

            migrationBuilder.DropColumn(
                name: "ProviderReference",
                table: "FiscalDocuments");

            migrationBuilder.DropColumn(
                name: "XmlUrl",
                table: "FiscalDocuments");
        }
    }
}
