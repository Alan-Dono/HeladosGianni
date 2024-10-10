using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccesLayer.Migrations
{
    /// <inheritdoc />
    public partial class FixTurno : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ventas_Empleado_EmpleadoId",
                table: "Ventas");

            migrationBuilder.DropIndex(
                name: "IX_Ventas_EmpleadoId",
                table: "Ventas");

            migrationBuilder.DropColumn(
                name: "EmpleadoId",
                table: "Ventas");

            migrationBuilder.DropColumn(
                name: "IdsDetallesVentas",
                table: "Ventas");

            migrationBuilder.DropColumn(
                name: "IdsCierreCajas",
                table: "Turnos");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "EmpleadoId",
                table: "Ventas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "IdsDetallesVentas",
                table: "Ventas",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "IdsCierreCajas",
                table: "Turnos",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Ventas_EmpleadoId",
                table: "Ventas",
                column: "EmpleadoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Ventas_Empleado_EmpleadoId",
                table: "Ventas",
                column: "EmpleadoId",
                principalTable: "Empleado",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
