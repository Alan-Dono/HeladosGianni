using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace DataAccesLayer.Helpers
{
    public static class Soporte
    {
        // Método para obtener una entidad por ID
        public static async Task<T> ObtenerEntidadPorId<T>(DbContext context, int id) where T : class
        {
            return await context.Set<T>().FindAsync(id);
        }


    }
}
