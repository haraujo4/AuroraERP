using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Aurora.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "organization");

            migrationBuilder.CreateTable(
                name: "GruposEmpresariais",
                schema: "organization",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Codigo = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    RazaoSocialConsolidada = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    NomeFantasia = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    PaisConsolidacao = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    MoedaBase = table.Column<string>(type: "character varying(3)", maxLength: 3, nullable: false),
                    IdiomaPadrao = table.Column<string>(type: "character varying(5)", maxLength: 5, nullable: false),
                    RegimeFiscalConsolidado = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GruposEmpresariais", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Empresas",
                schema: "organization",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    GrupoEmpresarialId = table.Column<Guid>(type: "uuid", nullable: false),
                    Codigo = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    RazaoSocial = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    NomeFantasia = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    CNPJ = table.Column<string>(type: "character varying(14)", maxLength: 14, nullable: false),
                    InscricaoEstadual = table.Column<string>(type: "text", nullable: false),
                    InscricaoMunicipal = table.Column<string>(type: "text", nullable: false),
                    CNAEPrincipal = table.Column<string>(type: "text", nullable: false),
                    NaturezaJuridica = table.Column<string>(type: "text", nullable: false),
                    RegimeTributario = table.Column<string>(type: "text", nullable: false),
                    Street = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Number = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Complement = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Neighborhood = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    City = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    State = table.Column<string>(type: "character varying(2)", maxLength: 2, nullable: false),
                    Country = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    ZipCode = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    MoedaLocal = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Empresas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Empresas_GruposEmpresariais_GrupoEmpresarialId",
                        column: x => x.GrupoEmpresarialId,
                        principalSchema: "organization",
                        principalTable: "GruposEmpresariais",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CentrosCusto",
                schema: "organization",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    EmpresaId = table.Column<Guid>(type: "uuid", nullable: false),
                    Codigo = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Descricao = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Responsavel = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    HierarquiaPaiId = table.Column<Guid>(type: "uuid", nullable: true),
                    ValidadeInicio = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ValidadeFim = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CentrosCusto", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CentrosCusto_Empresas_EmpresaId",
                        column: x => x.EmpresaId,
                        principalSchema: "organization",
                        principalTable: "Empresas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CentrosLucro",
                schema: "organization",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    EmpresaId = table.Column<Guid>(type: "uuid", nullable: false),
                    UnidadeNegocioId = table.Column<Guid>(type: "uuid", nullable: true),
                    Codigo = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Descricao = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Responsavel = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CentrosLucro", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CentrosLucro_Empresas_EmpresaId",
                        column: x => x.EmpresaId,
                        principalSchema: "organization",
                        principalTable: "Empresas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Filiais",
                schema: "organization",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    EmpresaId = table.Column<Guid>(type: "uuid", nullable: false),
                    Codigo = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    Descricao = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Street = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Number = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Complement = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Neighborhood = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    City = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    State = table.Column<string>(type: "character varying(2)", maxLength: 2, nullable: false),
                    Country = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    ZipCode = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Tipo = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Filiais", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Filiais_Empresas_EmpresaId",
                        column: x => x.EmpresaId,
                        principalSchema: "organization",
                        principalTable: "Empresas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Depositos",
                schema: "organization",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    FilialId = table.Column<Guid>(type: "uuid", nullable: false),
                    Codigo = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    Descricao = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Street = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Number = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Complement = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Neighborhood = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    City = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    State = table.Column<string>(type: "character varying(2)", maxLength: 2, nullable: false),
                    Country = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    ZipCode = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Tipo = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    ControlaLote = table.Column<bool>(type: "boolean", nullable: false),
                    ControlaSerie = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Depositos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Depositos_Filiais_FilialId",
                        column: x => x.FilialId,
                        principalSchema: "organization",
                        principalTable: "Filiais",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LocaisEstoque",
                schema: "organization",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    DepositoId = table.Column<Guid>(type: "uuid", nullable: false),
                    Codigo = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Tipo = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    PermitePicking = table.Column<bool>(type: "boolean", nullable: false),
                    PermiteInventario = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LocaisEstoque", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LocaisEstoque_Depositos_DepositoId",
                        column: x => x.DepositoId,
                        principalSchema: "organization",
                        principalTable: "Depositos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CentrosCusto_EmpresaId",
                schema: "organization",
                table: "CentrosCusto",
                column: "EmpresaId");

            migrationBuilder.CreateIndex(
                name: "IX_CentrosLucro_EmpresaId",
                schema: "organization",
                table: "CentrosLucro",
                column: "EmpresaId");

            migrationBuilder.CreateIndex(
                name: "IX_Depositos_FilialId",
                schema: "organization",
                table: "Depositos",
                column: "FilialId");

            migrationBuilder.CreateIndex(
                name: "IX_Empresas_GrupoEmpresarialId",
                schema: "organization",
                table: "Empresas",
                column: "GrupoEmpresarialId");

            migrationBuilder.CreateIndex(
                name: "IX_Filiais_EmpresaId",
                schema: "organization",
                table: "Filiais",
                column: "EmpresaId");

            migrationBuilder.CreateIndex(
                name: "IX_LocaisEstoque_DepositoId",
                schema: "organization",
                table: "LocaisEstoque",
                column: "DepositoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CentrosCusto",
                schema: "organization");

            migrationBuilder.DropTable(
                name: "CentrosLucro",
                schema: "organization");

            migrationBuilder.DropTable(
                name: "LocaisEstoque",
                schema: "organization");

            migrationBuilder.DropTable(
                name: "Depositos",
                schema: "organization");

            migrationBuilder.DropTable(
                name: "Filiais",
                schema: "organization");

            migrationBuilder.DropTable(
                name: "Empresas",
                schema: "organization");

            migrationBuilder.DropTable(
                name: "GruposEmpresariais",
                schema: "organization");
        }
    }
}
