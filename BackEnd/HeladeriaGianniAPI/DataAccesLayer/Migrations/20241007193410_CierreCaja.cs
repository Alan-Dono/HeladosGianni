using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccesLayer.Migrations
{
    /// <inheritdoc />
    public partial class CierreCaja : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Turnos_Empleado_EmpleadoId",
                table: "Turnos");

            migrationBuilder.DropTable(
                name: "Sabores");

            migrationBuilder.DropIndex(
                name: "IX_Turnos_EmpleadoId",
                table: "Turnos");

            migrationBuilder.RenameColumn(
                name: "EmpleadoId",
                table: "Turnos",
                newName: "CantidadDeVentas");

            migrationBuilder.AddColumn<int>(
                name: "CierreCajaId",
                table: "Ventas",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CantidadCierresParciales",
                table: "Turnos",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<double>(
                name: "TotalDescuentos",
                table: "Turnos",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "TotalVentas",
                table: "Turnos",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.CreateTable(
                name: "CierreCajas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TotalVentas = table.Column<double>(type: "float", nullable: false),
                    TotalDescuentos = table.Column<double>(type: "float", nullable: false),
                    EmpleadoId = table.Column<int>(type: "int", nullable: false),
                    CantidadDeVetnas = table.Column<int>(type: "int", nullable: false),
                    FechaInicio = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaFin = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TurnoId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CierreCajas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CierreCajas_Empleado_EmpleadoId",
                        column: x => x.EmpleadoId,
                        principalTable: "Empleado",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CierreCajas_Turnos_TurnoId",
                        column: x => x.TurnoId,
                        principalTable: "Turnos",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Ventas_CierreCajaId",
                table: "Ventas",
                column: "CierreCajaId");

            migrationBuilder.CreateIndex(
                name: "IX_CierreCajas_EmpleadoId",
                table: "CierreCajas",
                column: "EmpleadoId");

            migrationBuilder.CreateIndex(
                name: "IX_CierreCajas_TurnoId",
                table: "CierreCajas",
                column: "TurnoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Ventas_CierreCajas_CierreCajaId",
                table: "Ventas",
                column: "CierreCajaId",
                principalTable: "CierreCajas",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ventas_CierreCajas_CierreCajaId",
                table: "Ventas");

            migrationBuilder.DropTable(
                name: "CierreCajas");

            migrationBuilder.DropIndex(
                name: "IX_Ventas_CierreCajaId",
                table: "Ventas");

            migrationBuilder.DropColumn(
                name: "CierreCajaId",
                table: "Ventas");

            migrationBuilder.DropColumn(
                name: "CantidadCierresParciales",
                table: "Turnos");

            migrationBuilder.DropColumn(
                name: "TotalDescuentos",
                table: "Turnos");

            migrationBuilder.DropColumn(
                name: "TotalVentas",
                table: "Turnos");

            migrationBuilder.RenameColumn(
                name: "CantidadDeVentas",
                table: "Turnos",
                newName: "EmpleadoId");

            migrationBuilder.CreateTable(
                name: "Sabores",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sabores", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Turnos_EmpleadoId",
                table: "Turnos",
                column: "EmpleadoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Turnos_Empleado_EmpleadoId",
                table: "Turnos",
                column: "EmpleadoId",
                principalTable: "Empleado",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
