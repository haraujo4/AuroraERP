using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Aurora.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddMRPPlanningFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LeadTimeDays",
                schema: "logistics",
                table: "Materials",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ProcurementType",
                schema: "logistics",
                table: "Materials",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "SafetyStock",
                schema: "logistics",
                table: "Materials",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateTable(
                name: "ProductionOrderComponents",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProductionOrderId = table.Column<Guid>(type: "uuid", nullable: false),
                    ComponentId = table.Column<Guid>(type: "uuid", nullable: false),
                    QuantityRequired = table.Column<decimal>(type: "numeric", nullable: false),
                    QuantityConsumed = table.Column<decimal>(type: "numeric", nullable: false),
                    QuantityReserved = table.Column<decimal>(type: "numeric", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductionOrderComponents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductionOrderComponents_Materials_ComponentId",
                        column: x => x.ComponentId,
                        principalSchema: "logistics",
                        principalTable: "Materials",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProductionOrderComponents_ProductionOrders_ProductionOrderId",
                        column: x => x.ProductionOrderId,
                        principalTable: "ProductionOrders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProductionOrderComponents_ComponentId",
                table: "ProductionOrderComponents",
                column: "ComponentId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductionOrderComponents_ProductionOrderId",
                table: "ProductionOrderComponents",
                column: "ProductionOrderId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProductionOrderComponents");

            migrationBuilder.DropColumn(
                name: "LeadTimeDays",
                schema: "logistics",
                table: "Materials");

            migrationBuilder.DropColumn(
                name: "ProcurementType",
                schema: "logistics",
                table: "Materials");

            migrationBuilder.DropColumn(
                name: "SafetyStock",
                schema: "logistics",
                table: "Materials");
        }
    }
}
