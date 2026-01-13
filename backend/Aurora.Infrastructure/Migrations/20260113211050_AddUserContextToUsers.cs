using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Aurora.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUserContextToUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "EmpresaId",
                table: "Users",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "FilialId",
                table: "Users",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_EmpresaId",
                table: "Users",
                column: "EmpresaId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_FilialId",
                table: "Users",
                column: "FilialId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Empresas_EmpresaId",
                table: "Users",
                column: "EmpresaId",
                principalSchema: "organization",
                principalTable: "Empresas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Filiais_FilialId",
                table: "Users",
                column: "FilialId",
                principalSchema: "organization",
                principalTable: "Filiais",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Empresas_EmpresaId",
                table: "Users");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Filiais_FilialId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_EmpresaId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_FilialId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "EmpresaId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "FilialId",
                table: "Users");
        }
    }
}
