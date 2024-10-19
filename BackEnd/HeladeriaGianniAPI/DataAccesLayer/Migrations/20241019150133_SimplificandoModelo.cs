using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccesLayer.Migrations
{
    /// <inheritdoc />
    public partial class SimplificandoModelo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CierreCajas_Empleado_IdEmpleado",
                table: "CierreCajas");

            migrationBuilder.DropForeignKey(
                name: "FK_DetalleVenta_Productos_ProductoId",
                table: "DetalleVenta");

            migrationBuilder.DropForeignKey(
                name: "FK_DetalleVenta_Ventas_VentaId",
                table: "DetalleVenta");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Empleado",
                table: "Empleado");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DetalleVenta",
                table: "DetalleVenta");

            migrationBuilder.DropColumn(
                name: "CantidadCierresParciales",
                table: "Turnos");

            migrationBuilder.DropColumn(
                name: "CantidadDeVentas",
                table: "Turnos");

            migrationBuilder.DropColumn(
                name: "TotalDescuentos",
                table: "Turnos");

            migrationBuilder.DropColumn(
                name: "TotalVentas",
                table: "Turnos");

            migrationBuilder.DropColumn(
                name: "CantidadDeVetnas",
                table: "CierreCajas");

            migrationBuilder.DropColumn(
                name: "TotalDescuentos",
                table: "CierreCajas");

            migrationBuilder.DropColumn(
                name: "TotalVentas",
                table: "CierreCajas");

            migrationBuilder.RenameTable(
                name: "Empleado",
                newName: "Empleados");

            migrationBuilder.RenameTable(
                name: "DetalleVenta",
                newName: "DetallesVentas");

            migrationBuilder.RenameIndex(
                name: "IX_DetalleVenta_VentaId",
                table: "DetallesVentas",
                newName: "IX_DetallesVentas_VentaId");

            migrationBuilder.RenameIndex(
                name: "IX_DetalleVenta_ProductoId",
                table: "DetallesVentas",
                newName: "IX_DetallesVentas_ProductoId");

            migrationBuilder.AddColumn<string>(
                name: "IdsVentas",
                table: "CierreCajas",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "[]");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Empleados",
                table: "Empleados",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DetallesVentas",
                table: "DetallesVentas",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CierreCajas_Empleados_IdEmpleado",
                table: "CierreCajas",
                column: "IdEmpleado",
                principalTable: "Empleados",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DetallesVentas_Productos_ProductoId",
                table: "DetallesVentas",
                column: "ProductoId",
                principalTable: "Productos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DetallesVentas_Ventas_VentaId",
                table: "DetallesVentas",
                column: "VentaId",
                principalTable: "Ventas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CierreCajas_Empleados_IdEmpleado",
                table: "CierreCajas");

            migrationBuilder.DropForeignKey(
                name: "FK_DetallesVentas_Productos_ProductoId",
                table: "DetallesVentas");

            migrationBuilder.DropForeignKey(
                name: "FK_DetallesVentas_Ventas_VentaId",
                table: "DetallesVentas");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Empleados",
                table: "Empleados");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DetallesVentas",
                table: "DetallesVentas");

            migrationBuilder.DropColumn(
                name: "IdsVentas",
                table: "CierreCajas");

            migrationBuilder.RenameTable(
                name: "Empleados",
                newName: "Empleado");

            migrationBuilder.RenameTable(
                name: "DetallesVentas",
                newName: "DetalleVenta");

            migrationBuilder.RenameIndex(
                name: "IX_DetallesVentas_VentaId",
                table: "DetalleVenta",
                newName: "IX_DetalleVenta_VentaId");

            migrationBuilder.RenameIndex(
                name: "IX_DetallesVentas_ProductoId",
                table: "DetalleVenta",
                newName: "IX_DetalleVenta_ProductoId");

            migrationBuilder.AddColumn<int>(
                name: "CantidadCierresParciales",
                table: "Turnos",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CantidadDeVentas",
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

            migrationBuilder.AddColumn<int>(
                name: "CantidadDeVetnas",
                table: "CierreCajas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<double>(
                name: "TotalDescuentos",
                table: "CierreCajas",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "TotalVentas",
                table: "CierreCajas",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Empleado",
                table: "Empleado",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DetalleVenta",
                table: "DetalleVenta",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CierreCajas_Empleado_IdEmpleado",
                table: "CierreCajas",
                column: "IdEmpleado",
                principalTable: "Empleado",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DetalleVenta_Productos_ProductoId",
                table: "DetalleVenta",
                column: "ProductoId",
                principalTable: "Productos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DetalleVenta_Ventas_VentaId",
                table: "DetalleVenta",
                column: "VentaId",
                principalTable: "Ventas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
