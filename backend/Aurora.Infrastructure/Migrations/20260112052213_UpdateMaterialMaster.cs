using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Aurora.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateMaterialMaster : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Code",
                schema: "logistics",
                table: "Materials",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(20)",
                oldMaxLength: 20);

            migrationBuilder.AddColumn<string>(
                name: "DimensionUnit",
                schema: "logistics",
                table: "Materials",
                type: "character varying(10)",
                maxLength: 10,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "GrossWeight",
                schema: "logistics",
                table: "Materials",
                type: "numeric(18,4)",
                precision: 18,
                scale: 4,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Group",
                schema: "logistics",
                table: "Materials",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "Height",
                schema: "logistics",
                table: "Materials",
                type: "numeric(18,4)",
                precision: 18,
                scale: 4,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsBatchManaged",
                schema: "logistics",
                table: "Materials",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsSerialManaged",
                schema: "logistics",
                table: "Materials",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "Length",
                schema: "logistics",
                table: "Materials",
                type: "numeric(18,4)",
                precision: 18,
                scale: 4,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "MaxStock",
                schema: "logistics",
                table: "Materials",
                type: "numeric(18,4)",
                precision: 18,
                scale: 4,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "MinStock",
                schema: "logistics",
                table: "Materials",
                type: "numeric(18,4)",
                precision: 18,
                scale: 4,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "NetWeight",
                schema: "logistics",
                table: "Materials",
                type: "numeric(18,4)",
                precision: 18,
                scale: 4,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PurchasingUnit",
                schema: "logistics",
                table: "Materials",
                type: "character varying(10)",
                maxLength: 10,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SalesUnit",
                schema: "logistics",
                table: "Materials",
                type: "character varying(10)",
                maxLength: 10,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "StandardCost",
                schema: "logistics",
                table: "Materials",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TaxClassification",
                schema: "logistics",
                table: "Materials",
                type: "character varying(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WeightUnit",
                schema: "logistics",
                table: "Materials",
                type: "character varying(10)",
                maxLength: 10,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Width",
                schema: "logistics",
                table: "Materials",
                type: "numeric(18,4)",
                precision: 18,
                scale: 4,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Materials_Code",
                schema: "logistics",
                table: "Materials",
                column: "Code",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Materials_Code",
                schema: "logistics",
                table: "Materials");

            migrationBuilder.DropColumn(
                name: "DimensionUnit",
                schema: "logistics",
                table: "Materials");

            migrationBuilder.DropColumn(
                name: "GrossWeight",
                schema: "logistics",
                table: "Materials");

            migrationBuilder.DropColumn(
                name: "Group",
                schema: "logistics",
                table: "Materials");

            migrationBuilder.DropColumn(
                name: "Height",
                schema: "logistics",
                table: "Materials");

            migrationBuilder.DropColumn(
                name: "IsBatchManaged",
                schema: "logistics",
                table: "Materials");

            migrationBuilder.DropColumn(
                name: "IsSerialManaged",
                schema: "logistics",
                table: "Materials");

            migrationBuilder.DropColumn(
                name: "Length",
                schema: "logistics",
                table: "Materials");

            migrationBuilder.DropColumn(
                name: "MaxStock",
                schema: "logistics",
                table: "Materials");

            migrationBuilder.DropColumn(
                name: "MinStock",
                schema: "logistics",
                table: "Materials");

            migrationBuilder.DropColumn(
                name: "NetWeight",
                schema: "logistics",
                table: "Materials");

            migrationBuilder.DropColumn(
                name: "PurchasingUnit",
                schema: "logistics",
                table: "Materials");

            migrationBuilder.DropColumn(
                name: "SalesUnit",
                schema: "logistics",
                table: "Materials");

            migrationBuilder.DropColumn(
                name: "StandardCost",
                schema: "logistics",
                table: "Materials");

            migrationBuilder.DropColumn(
                name: "TaxClassification",
                schema: "logistics",
                table: "Materials");

            migrationBuilder.DropColumn(
                name: "WeightUnit",
                schema: "logistics",
                table: "Materials");

            migrationBuilder.DropColumn(
                name: "Width",
                schema: "logistics",
                table: "Materials");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                schema: "logistics",
                table: "Materials",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50);
        }
    }
}
