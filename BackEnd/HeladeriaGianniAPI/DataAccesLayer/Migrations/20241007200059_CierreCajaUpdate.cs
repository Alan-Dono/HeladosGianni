using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccesLayer.Migrations
{
    /// <inheritdoc />
    public partial class CierreCajaUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CierreCajas_Turnos_TurnoId",
                table: "CierreCajas");

            migrationBuilder.AlterColumn<int>(
                name: "TurnoId",
                table: "CierreCajas",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "IdTurno",
                table: "CierreCajas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "IdVentas",
                table: "CierreCajas",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "[]");

            migrationBuilder.AddForeignKey(
                name: "FK_CierreCajas_Turnos_TurnoId",
                table: "CierreCajas",
                column: "TurnoId",
                principalTable: "Turnos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CierreCajas_Turnos_TurnoId",
                table: "CierreCajas");

            migrationBuilder.DropColumn(
                name: "IdTurno",
                table: "CierreCajas");

            migrationBuilder.DropColumn(
                name: "IdVentas",
                table: "CierreCajas");

            migrationBuilder.AlterColumn<int>(
                name: "TurnoId",
                table: "CierreCajas",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_CierreCajas_Turnos_TurnoId",
                table: "CierreCajas",
                column: "TurnoId",
                principalTable: "Turnos",
                principalColumn: "Id");
        }
    }
}
