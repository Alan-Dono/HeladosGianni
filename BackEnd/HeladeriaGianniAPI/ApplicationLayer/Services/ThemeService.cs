using System.IO;
using System.Threading.Tasks;
using System.Text.Json;

namespace ApplicationLayer.Services
{
    public class ThemeService
    {
        private static readonly string RUTA_THEME = Path.Combine(
            @"C:\Users\ALAN\Desktop\RUTAS",
            "Theme.txt");

        public async Task<TemaColors> ObtenerTemaAsync()
        {
            try
            {
                if (!File.Exists(RUTA_THEME))
                {
                    // Si el archivo no existe, creamos uno con valores por defecto
                    var temaPorDefecto = new TemaColors
                    {
                        Primary = "#2f27ce",
                        Secondary = "#dddbff",
                        Background = "#fbfbfe",
                        Text = "#050316",
                        Accent = "#443dff"
                    };

                    await GuardarTemaAsync(temaPorDefecto);
                    return temaPorDefecto;
                }

                string contenido = await File.ReadAllTextAsync(RUTA_THEME);
                var tema = JsonSerializer.Deserialize<TemaColors>(contenido);
                return tema ?? new TemaColors();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error leyendo tema: {ex.Message}");
                return new TemaColors(); // Tema por defecto en caso de error
            }
        }

        public async Task GuardarTemaAsync(TemaColors tema)
        {
            try
            {
                string contenido = JsonSerializer.Serialize(tema, new JsonSerializerOptions
                {
                    WriteIndented = true
                });

                // Asegurar que el directorio existe
                var directorio = Path.GetDirectoryName(RUTA_THEME);
                if (!Directory.Exists(directorio))
                {
                    Directory.CreateDirectory(directorio);
                }

                await File.WriteAllTextAsync(RUTA_THEME, contenido);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error guardando tema: {ex.Message}");
                throw;
            }
        }

        public async Task RestablecerTemaPorDefectoAsync()
        {
            var temaPorDefecto = new TemaColors
            {
                Primary = "#2f27ce",
                Secondary = "#dddbff",
                Background = "#fbfbfe",
                Text = "#050316",
                Accent = "#443dff"
            };

            await GuardarTemaAsync(temaPorDefecto);
        }
    }

    public class TemaColors
    {
        public string Primary { get; set; } = "#2f27ce";
        public string Secondary { get; set; } = "#dddbff";
        public string Background { get; set; } = "#fbfbfe";
        public string Text { get; set; } = "#050316";
        public string Accent { get; set; } = "#443dff";
    }
}