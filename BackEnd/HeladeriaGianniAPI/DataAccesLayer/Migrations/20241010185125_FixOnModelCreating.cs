using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccesLayer.Migrations
{
    /// <inheritdoc />
    public partial class FixOnModelCreating : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CierreCajas_Empleado_EmpleadoId",
                table: "CierreCajas");

            migrationBuilder.DropForeignKey(
                name: "FK_CierreCajas_Turnos_TurnoId",
                table: "CierreCajas");

            migrationBuilder.DropForeignKey(
                name: "FK_Ventas_CierreCajas_CierreCajaId",
                table: "Ventas");

            migrationBuilder.DropIndex(
                name: "IX_Ventas_CierreCajaId",
                table: "Ventas");

            migrationBuilder.DropIndex(
                name: "IX_ProductoCategorias_NombreCategoria",
                table: "ProductoCategorias");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DetalleVenta",
                table: "DetalleVenta");

            migrationBuilder.DropIndex(
                name: "IX_DetalleVenta_VentaId",
                table: "DetalleVenta");

            migrationBuilder.DropIndex(
                name: "IX_CierreCajas_EmpleadoId",
                table: "CierreCajas");

            migrationBuilder.DropIndex(
                name: "IX_CierreCajas_TurnoId",
                table: "CierreCajas");

            migrationBuilder.DropColumn(
                name: "CierreCajaId",
                table: "Ventas");

            migrationBuilder.DropColumn(
                name: "IdTurno",
                table: "Ventas");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "DetalleVenta");

            migrationBuilder.DropColumn(
                name: "EmpleadoId",
                table: "CierreCajas");

            migrationBuilder.DropColumn(
                name: "TurnoId",
                table: "CierreCajas");

            migrationBuilder.AlterColumn<double>(
                name: "Descuentos",
                table: "Ventas",
                type: "float",
                nullable: false,
                defaultValue: 0.0,
                oldClrType: typeof(double),
                oldType: "float",
                oldNullable: true);

            migrationBuilder.AlterColumn<double>(
                name: "TotalVentas",
                table: "Turnos",
                type: "float",
                nullable: false,
                defaultValue: 0.0,
                oldClrType: typeof(double),
                oldType: "float",
                oldNullable: true);

            migrationBuilder.AlterColumn<double>(
                name: "TotalDescuentos",
                table: "Turnos",
                type: "float",
                nullable: false,
                defaultValue: 0.0,
                oldClrType: typeof(double),
                oldType: "float",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CantidadDeVentas",
                table: "Turnos",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CantidadCierresParciales",
                table: "Turnos",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "NombreCategoria",
                table: "ProductoCategorias",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DetalleVenta",
                table: "DetalleVenta",
                columns: new[] { "VentaId", "ProductoId" });

            migrationBuilder.CreateIndex(
                name: "IX_Ventas_IdCierreCaja",
                table: "Ventas",
                column: "IdCierreCaja");

            migrationBuilder.CreateIndex(
                name: "IX_CierreCajas_IdEmpleado",
                table: "CierreCajas",
                column: "IdEmpleado");

            migrationBuilder.CreateIndex(
                name: "IX_CierreCajas_IdTurno",
                table: "CierreCajas",
                column: "IdTurno");

            migrationBuilder.AddForeignKey(
                name: "FK_CierreCajas_Empleado_IdEmpleado",
                table: "CierreCajas",
                column: "IdEmpleado",
                principalTable: "Empleado",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CierreCajas_Turnos_IdTurno",
                table: "CierreCajas",
                column: "IdTurno",
                principalTable: "Turnos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Ventas_CierreCajas_IdCierreCaja",
                table: "Ventas",
                column: "IdCierreCaja",
                principalTable: "CierreCajas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CierreCajas_Empleado_IdEmpleado",
                table: "CierreCajas");

            migrationBuilder.DropForeignKey(
                name: "FK_CierreCajas_Turnos_IdTurno",
                table: "CierreCajas");

            migrationBuilder.DropForeignKey(
                name: "FK_Ventas_CierreCajas_IdCierreCaja",
                table: "Ventas");

            migrationBuilder.DropIndex(
                name: "IX_Ventas_IdCierreCaja",
                table: "Ventas");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DetalleVenta",
                table: "DetalleVenta");

            migrationBuilder.DropIndex(
                name: "IX_CierreCajas_IdEmpleado",
                table: "CierreCajas");

            migrationBuilder.DropIndex(
                name: "IX_CierreCajas_IdTurno",
                table: "CierreCajas");

            migrationBuilder.AlterColumn<double>(
                name: "Descuentos",
                table: "Ventas",
                type: "float",
                nullable: true,
                oldClrType: typeof(double),
                oldType: "float");

            migrationBuilder.AddColumn<int>(
                name: "CierreCajaId",
                table: "Ventas",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "IdTurno",
                table: "Ventas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<double>(
                name: "TotalVentas",
                table: "Turnos",
                type: "float",
                nullable: true,
                oldClrType: typeof(double),
                oldType: "float");

            migrationBuilder.AlterColumn<double>(
                name: "TotalDescuentos",
                table: "Turnos",
                type: "float",
                nullable: true,
                oldClrType: typeof(double),
                oldType: "float");

            migrationBuilder.AlterColumn<int>(
                name: "CantidadDeVentas",
                table: "Turnos",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "CantidadCierresParciales",
                table: "Turnos",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "NombreCategoria",
                table: "ProductoCategorias",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "DetalleVenta",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<int>(
                name: "EmpleadoId",
                table: "CierreCajas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TurnoId",
                table: "CierreCajas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_DetalleVenta",
                table: "DetalleVenta",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Ventas_CierreCajaId",
                table: "Ventas",
                column: "CierreCajaId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductoCategorias_NombreCategoria",
                table: "ProductoCategorias",
                column: "NombreCategoria",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DetalleVenta_VentaId",
                table: "DetalleVenta",
                column: "VentaId");

            migrationBuilder.CreateIndex(
                name: "IX_CierreCajas_EmpleadoId",
                table: "CierreCajas",
                column: "EmpleadoId");

            migrationBuilder.CreateIndex(
                name: "IX_CierreCajas_TurnoId",
                table: "CierreCajas",
                column: "TurnoId");

            migrationBuilder.AddForeignKey(
                name: "FK_CierreCajas_Empleado_EmpleadoId",
                table: "CierreCajas",
                column: "EmpleadoId",
                principalTable: "Empleado",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CierreCajas_Turnos_TurnoId",
                table: "CierreCajas",
                column: "TurnoId",
                principalTable: "Turnos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Ventas_CierreCajas_CierreCajaId",
                table: "Ventas",
                column: "CierreCajaId",
                principalTable: "CierreCajas",
                principalColumn: "Id");
        }
    }
}
