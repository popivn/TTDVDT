using Microsoft.EntityFrameworkCore;
using TTDVDTTNCXH.Data;
using TTDVDTTNCXH.Models;

namespace TTDVDTTNCXH.Repositories
{
    public class FacultyRepository : IFacultyRepository
    {
        private readonly AppDbContext _context;

        public FacultyRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Faculty>> GetAllAsync()
        {
            return await _context.Faculties.ToListAsync();
        }

        public async Task<Faculty?> GetByIdAsync(ulong id)
        {
            return await _context.Faculties
                .FirstOrDefaultAsync(f => f.Id == id);
        }
    }
}

