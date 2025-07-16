using ApplicationLayer.Helper;
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


// Configuración del AfipService con inyección de dependencias
// Configuración del LoginTicket como dependencia
builder.Services.AddScoped<LoginTicket>();

// Configuración del AfipService con inyección de dependencias
builder.Services.AddScoped<AfipService>(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();

    // Validación de configuraciones requeridas
    string certificatePath = configuration["Afip:CertificatePath"] ?? "C:\\www\\HELADERIA-GIANNI\\AfipTest\\certificado.pfx";
    string certPassword = configuration["Afip:CertPassword"] ?? "12345678";
    string wsaaUrl = configuration["Afip:WsaaUrl"] ?? "https://wsaahomo.afip.gov.ar/ws/services/LoginCms?WSDL";

    // Validar configuración mínima
    if (string.IsNullOrWhiteSpace(certificatePath) || string.IsNullOrWhiteSpace(certPassword) || string.IsNullOrWhiteSpace(wsaaUrl))
    {
        throw new Exception("Faltan configuraciones requeridas para el servicio AFIP en el archivo appsettings.json.");
    }

    var loginTicket = provider.GetRequiredService<LoginTicket>();

    // Configurar el servicio AFIP con los valores adecuados
    return new AfipService(configuration, loginTicket);
});



// Configuración de WSFEService con dependencias
builder.Services.AddScoped<WSFEService>(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    var afipService = provider.GetRequiredService<AfipService>();

    // Leer configuración para CUIT y PUNTO_VENTA
    string cuit = configuration["Afip:CUIT"];
    int puntoVenta = int.Parse(configuration["Afip:PuntoVenta"]);

    // Validar configuración de CUIT y PUNTO_VENTA
    if (string.IsNullOrWhiteSpace(cuit) || puntoVenta <= 0)
    {
        throw new Exception("Faltan configuraciones requeridas para el servicio WSFE en el archivo appsettings.json.");
    }

    return new WSFEService(cuit, puntoVenta, afipService);
});




// Agregar configuración para leer el archivo appsettings.json
builder.Services.AddSingleton<IConfiguration>(builder.Configuration);

builder.Services.AddScoped<ImpresoraTicketService>();

builder.Services.AddScoped<IEmpleadoRepository, EmpleadoRepository>();
builder.Services.AddScoped<EmpleadoService>();

builder.Services.AddScoped<ITurnoRepository, TurnoRepository>();
builder.Services.AddScoped<TurnoService>();

builder.Services.AddScoped<IProductoCategoriaRepository, ProductoCategoriaRepository>();
builder.Services.AddScoped<ProductoCategoriaService>();

//builder.Services.AddScoped<IProveedorRepository, ProveedorRepository>();
//builder.Services.AddScoped<ProveedorService>();

builder.Services.AddScoped<IProductoRepository, ProductoRepository>();
builder.Services.AddScoped<ProductoService>();

builder.Services.AddScoped<IVentaRepository, VentaRepository>();
builder.Services.AddScoped<VentaService>();

builder.Services.AddScoped<ICierreCajaRepository, CierreCajaRepository>();
builder.Services.AddScoped<CierreCajaService>();

//builder.Services.AddScoped<CalculadoraVentas>();
// Configuración de AutoMapper
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());


// Configuración de Newtonsoft.Json para usar la cultura invariante
builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.Culture = CultureInfo.InvariantCulture;
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
    });


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuración de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", builder =>
    {
        builder.WithOrigins("http://localhost:5173") // Asegúrate de que esta URL sea correcta
               .AllowAnyMethod()
               .AllowAnyHeader();
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

// Habilitar archivos estáticos
app.UseStaticFiles(); // Esto sirve archivos desde wwwroot por defecto


app.UseHttpsRedirection();

app.UseCors("AllowReactApp");


app.UseAuthorization();
 
app.MapControllers();

app.Run();
