using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Aurora.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddBusinessPartner : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "commercial");

            migrationBuilder.CreateTable(
                name: "BusinessPartners",
                schema: "commercial",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Codigo = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Tipo = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    RazaoSocial = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    NomeFantasia = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    CpfCnpj = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    RgIe = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    LimiteCredito = table.Column<decimal>(type: "numeric", nullable: false),
                    BloqueadoFinanceiro = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BusinessPartners", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BusinessPartnerAddresses",
                schema: "commercial",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Type = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Street = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Number = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Complement = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Neighborhood = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    City = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    State = table.Column<string>(type: "character varying(2)", maxLength: 2, nullable: false),
                    Country = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    ZipCode = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    IsPrincipal = table.Column<bool>(type: "boolean", nullable: false),
                    BusinessPartnerId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BusinessPartnerAddresses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BusinessPartnerAddresses_BusinessPartners_BusinessPartnerId",
                        column: x => x.BusinessPartnerId,
                        principalSchema: "commercial",
                        principalTable: "BusinessPartners",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BusinessPartnerContacts",
                schema: "commercial",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Phone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Role = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    BusinessPartnerId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BusinessPartnerContacts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BusinessPartnerContacts_BusinessPartners_BusinessPartnerId",
                        column: x => x.BusinessPartnerId,
                        principalSchema: "commercial",
                        principalTable: "BusinessPartners",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BusinessPartnerAddresses_BusinessPartnerId",
                schema: "commercial",
                table: "BusinessPartnerAddresses",
                column: "BusinessPartnerId");

            migrationBuilder.CreateIndex(
                name: "IX_BusinessPartnerContacts_BusinessPartnerId",
                schema: "commercial",
                table: "BusinessPartnerContacts",
                column: "BusinessPartnerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BusinessPartnerAddresses",
                schema: "commercial");

            migrationBuilder.DropTable(
                name: "BusinessPartnerContacts",
                schema: "commercial");

            migrationBuilder.DropTable(
                name: "BusinessPartners",
                schema: "commercial");
        }
    }
}
