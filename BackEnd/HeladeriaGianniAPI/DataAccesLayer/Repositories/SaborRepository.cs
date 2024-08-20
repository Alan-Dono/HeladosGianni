using DomainLayer.Interface;
using DomainLayer.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccesLayer.Repositories
{
    public class SaborRepository : ISaborRepository
    {
        private readonly HeladeriaDbContext _context;

        public SaborRepository(HeladeriaDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Sabor>> ObtenerTodosAsync()
        {
            return await _context.Sabores.ToListAsync();
        }

        public async Task<Sabor> ObtenerPorIdAsync(int id)
        {
            return await _context.Sabores.FindAsync(id);
        }

        public async Task AgregarAsync(Sabor sabor)
        {
            await _context.Sabores.AddAsync(sabor);
            await _context.SaveChangesAsync();
        }
    }
}
