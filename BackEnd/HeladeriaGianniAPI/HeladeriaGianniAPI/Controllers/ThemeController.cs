using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text.Json.Serialization;

[ApiController]
[Route("api/theme")]
public class ThemeController : ControllerBase
{
    private readonly ILogger<ThemeController> _logger;
    private const string THEME_CONFIG_FILE = "theme_config.json";

    public ThemeController(ILogger<ThemeController> logger)
    {
        _logger = logger;
    }

    // Modelo para la configuración de colores
    public class ThemeColorsDto
    {
        [JsonPropertyName("colors")]
        public string Colors { get; set; }
    }

    public class ThemeConfigModel
    {
        [JsonPropertyName("light")]
        public LightThemeColors Light { get; set; }

        [JsonPropertyName("dark")]
        public DarkThemeColors Dark { get; set; }
    }

    public class LightThemeColors
    {
        [JsonPropertyName("Primary")]
        public string Primary { get; set; }

        [JsonPropertyName("Secondary")]
        public string Secondary { get; set; }

        [JsonPropertyName("Background")]
        public string Background { get; set; }

        [JsonPropertyName("Paper")]
        public string Paper { get; set; }

        [JsonPropertyName("Componentes")]
        public string Componentes { get; set; }

        [JsonPropertyName("TextPrimary")]
        public string TextPrimary { get; set; }

        [JsonPropertyName("TextSecondary")]
        public string TextSecondary { get; set; }

        [JsonPropertyName("Glow")]
        public string Glow { get; set; }
    }

    public class DarkThemeColors
    {
        [JsonPropertyName("Primary")]
        public string Primary { get; set; }

        [JsonPropertyName("Secondary")]
        public string Secondary { get; set; }

        [JsonPropertyName("Background")]
        public string Background { get; set; }

        [JsonPropertyName("Paper")]
        public string Paper { get; set; }

        [JsonPropertyName("Componentes")]
        public string Componentes { get; set; }

        [JsonPropertyName("TextPrimary")]
        public string TextPrimary { get; set; }

        [JsonPropertyName("TextSecondary")]
        public string TextSecondary { get; set; }

        [JsonPropertyName("Glow")]
        public string Glow { get; set; }

        [JsonPropertyName("GrayAccent")]
        public string GrayAccent { get; set; }
    }

    // GET: api/theme - Obtener configuración actual
    [HttpGet]
    public async Task<ActionResult<ThemeColorsDto>> GetTheme()
    {
        try
        {
            _logger.LogInformation("Obteniendo configuración de tema");

            if (!System.IO.File.Exists(THEME_CONFIG_FILE))
            {
                _logger.LogInformation("No existe archivo de configuración, devolviendo 404");
                return NotFound(new { message = "No hay configuración personalizada guardada" });
            }

            var jsonContent = await System.IO.File.ReadAllTextAsync(THEME_CONFIG_FILE);

            if (string.IsNullOrWhiteSpace(jsonContent))
            {
                _logger.LogWarning("Archivo de configuración está vacío");
                return NotFound(new { message = "Configuración está vacía" });
            }

            // Validar que sea JSON válido
            try
            {
                JsonDocument.Parse(jsonContent);
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "El archivo de configuración contiene JSON inválido");
                return BadRequest(new { message = "Archivo de configuración corrupto" });
            }

            var result = new ThemeColorsDto { Colors = jsonContent };

            _logger.LogInformation("Configuración de tema obtenida exitosamente");
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error obteniendo configuración de tema");
            return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
        }
    }

    // POST: api/theme - Guardar nueva configuración
    [HttpPost]
    public async Task<ActionResult> SaveTheme([FromBody] ThemeColorsDto themeDto)
    {
        try
        {
            _logger.LogInformation("Guardando configuración de tema");

            // Validar entrada
            if (themeDto == null || string.IsNullOrWhiteSpace(themeDto.Colors))
            {
                _logger.LogWarning("Datos de tema inválidos recibidos");
                return BadRequest(new { message = "Se requiere configuración de colores válida" });
            }

            // Validar que sea JSON válido y tenga la estructura correcta
            try
            {
                var config = JsonSerializer.Deserialize<ThemeConfigModel>(themeDto.Colors);

                if (config == null || config.Light == null || config.Dark == null)
                {
                    return BadRequest(new { message = "Configuración debe incluir tanto modo claro como oscuro" });
                }

                // Validar colores requeridos para modo claro
                if (string.IsNullOrWhiteSpace(config.Light.Primary) ||
                    string.IsNullOrWhiteSpace(config.Light.Secondary) ||
                    string.IsNullOrWhiteSpace(config.Light.Background))
                {
                    return BadRequest(new { message = "Faltan colores requeridos para modo claro" });
                }

                // Validar colores requeridos para modo oscuro
                if (string.IsNullOrWhiteSpace(config.Dark.Primary) ||
                    string.IsNullOrWhiteSpace(config.Dark.Secondary) ||
                    string.IsNullOrWhiteSpace(config.Dark.Background))
                {
                    return BadRequest(new { message = "Faltan colores requeridos para modo oscuro" });
                }

                // Validar formato de colores hex
                if (!IsValidHexColor(config.Light.Primary) || !IsValidHexColor(config.Dark.Primary))
                {
                    return BadRequest(new { message = "Formato de color inválido. Use formato #RRGGBB" });
                }
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "JSON de configuración inválido");
                return BadRequest(new { message = "Formato JSON inválido", error = ex.Message });
            }

            // Crear backup si existe archivo anterior
            if (System.IO.File.Exists(THEME_CONFIG_FILE))
            {
                var backupFile = $"{THEME_CONFIG_FILE}.backup_{DateTime.Now:yyyyMMdd_HHmmss}";
                System.IO.File.Copy(THEME_CONFIG_FILE, backupFile);
                _logger.LogInformation($"Backup creado: {backupFile}");
            }

            // Guardar nueva configuración
            await System.IO.File.WriteAllTextAsync(THEME_CONFIG_FILE, themeDto.Colors);

            _logger.LogInformation("Configuración de tema guardada exitosamente");

            return Ok(new
            {
                message = "Configuración guardada exitosamente",
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error guardando configuración de tema");
            return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
        }
    }

    // POST: api/theme/reset - Restablecer tema por defecto
    [HttpPost("reset")]
    public async Task<ActionResult> ResetTheme()
    {
        try
        {
            _logger.LogInformation("Restableciendo tema por defecto");

            // Crear backup si existe archivo
            if (System.IO.File.Exists(THEME_CONFIG_FILE))
            {
                var backupFile = $"{THEME_CONFIG_FILE}.backup_reset_{DateTime.Now:yyyyMMdd_HHmmss}";
                System.IO.File.Copy(THEME_CONFIG_FILE, backupFile);
                System.IO.File.Delete(THEME_CONFIG_FILE);
                _logger.LogInformation($"Archivo anterior respaldado como: {backupFile}");
            }

            _logger.LogInformation("Tema restablecido exitosamente");

            return Ok(new
            {
                message = "Tema restablecido a valores por defecto",
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error restableciendo tema");
            return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
        }
    }

    // GET: api/theme/default - Obtener configuración por defecto
    [HttpGet("default")]
    public ActionResult<ThemeColorsDto> GetDefaultTheme()
    {
        try
        {
            _logger.LogInformation("Obteniendo configuración por defecto");

            var defaultConfig = new ThemeConfigModel
            {
                Light = new LightThemeColors
                {
                    Primary = "#2f27ce",
                    Secondary = "#dddbff",
                    Background = "#fbfbfe",
                    Paper = "#ffffff",
                    Componentes = "#443dff",
                    TextPrimary = "#050316",
                    TextSecondary = "#050316",
                    Glow = "#b0adff"
                },
                Dark = new DarkThemeColors
                {
                    Primary = "#e35305",
                    Secondary = "#050bba",
                    Background = "#020b09",
                    Paper = "#0a1210",
                    Componentes = "#4403bf",
                    TextPrimary = "#e0f8f4",
                    TextSecondary = "#b8d6d2",
                    Glow = "#5a4dff",
                    GrayAccent = "#3a3a3a"
                }
            };

            var jsonConfig = JsonSerializer.Serialize(defaultConfig, new JsonSerializerOptions
            {
                WriteIndented = true
            });

            return Ok(new ThemeColorsDto { Colors = jsonConfig });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error obteniendo configuración por defecto");
            return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
        }
    }

    // GET: api/theme/backups - Listar backups disponibles
    [HttpGet("backups")]
    public ActionResult<IEnumerable<string>> GetBackups()
    {
        try
        {
            var backupFiles = Directory.GetFiles(".", $"{THEME_CONFIG_FILE}.backup_*")
                                     .Select(Path.GetFileName)
                                     .OrderByDescending(f => f)
                                     .Take(10);

            return Ok(backupFiles);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error obteniendo lista de backups");
            return StatusCode(500, new { message = "Error obteniendo backups", error = ex.Message });
        }
    }

    // Método auxiliar para validar colores hex
    private static bool IsValidHexColor(string color)
    {
        if (string.IsNullOrWhiteSpace(color))
            return false;

        return System.Text.RegularExpressions.Regex.IsMatch(color, @"^#[0-9A-F]{6}$",
            System.Text.RegularExpressions.RegexOptions.IgnoreCase);
    }
}