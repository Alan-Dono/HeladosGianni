using ApplicationLayer;
using ApplicationLayer.BusinessLogic;
using ApplicationLayer.Services;
using DataAccesLayer;
using DataAccesLayer.Repositories;
using DomainLayer.Interface;
using Microsoft.EntityFrameworkCore;
using System.Globalization;


var builder = WebApplication.CreateBuilder(args);

// Configuración de la cultura global (pasar valores con decimales)
CultureInfo.DefaultThreadCurrentCulture = new CultureInfo("en-US");
CultureInfo.DefaultThreadCurrentUICulture = new CultureInfo("en-US");

// Configuración de la base de datos
builder.Services.AddDbContext<HeladeriaDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        b => b.MigrationsAssembly("DataAccesLayer"))); // Especifica el ensamblado para las migraciones

// Inyección de dependencias
builder.Services.AddScoped<ISaborRepository, SaborRepository>();
builder.Services.AddScoped<GestionarSabores>();

builder.Services.AddScoped<IEmpleadoRepository, EmpleadoRepository>();
builder.Services.AddScoped<EmpleadoService>();

builder.Services.AddScoped<ITurnoRepository, TurnoRepository>();
builder.Services.AddScoped<TurnoService>();

builder.Services.AddScoped<IProductoCategoriaRepository, ProductoCategoriaRepository>();
builder.Services.AddScoped<ProductoCategoriaService>();

builder.Services.AddScoped<IProveedorRepository, ProveedorRepository>();
builder.Services.AddScoped<ProveedorService>();

builder.Services.AddScoped<IProductoRepository, ProductoRepository>();
builder.Services.AddScoped<ProductoService>();

builder.Services.AddScoped<IVentaRepository, VentaRepository>();
builder.Services.AddScoped<VentaService>();

builder.Services.AddScoped<CalculadoraVentas>();
// Configuración de AutoMapper
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// Configuración de Newtonsoft.Json para usar la cultura invariante
builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.Culture = CultureInfo.InvariantCulture;
    });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuracion de cors 
// Configuración de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", builder =>
    {
        builder.WithOrigins("http://localhost:5173") // La URL del frontend
               .AllowAnyMethod() // Permite cualquier método HTTP (GET, POST, PUT, etc.)
               .AllowAnyHeader() // Permite cualquier encabezado (headers)
               .AllowCredentials(); // Si utilizas autenticación basada en cookies o tokens
    });
});
var app = builder.Build();

#region VerificarConexionDB
// Verificar conexión a la base de datos
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<HeladeriaDbContext>();
    try
    {
        // Intenta acceder a la base de datos
        await dbContext.Database.CanConnectAsync();
        Console.WriteLine("Conectado con éxito a la base de datos.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error al conectar a la base de datos: {ex.Message}");
    }
}
#endregion

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowReactApp");


app.UseAuthorization();

app.MapControllers();

app.Run();
