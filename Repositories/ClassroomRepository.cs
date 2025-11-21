using Microsoft.EntityFrameworkCore;
using TTDVDTTNCXH.Data;
using TTDVDTTNCXH.Models;

namespace TTDVDTTNCXH.Repositories
{
    public class ClassroomRepository : IClassroomRepository
    {
        private readonly AppDbContext _context;

        public ClassroomRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Classroom>> GetAllAsync()
        {
            return await _context.Classrooms.ToListAsync();
        }

        public async Task<Classroom?> GetByIdAsync(ulong id)
        {
            return await _context.Classrooms
                .FirstOrDefaultAsync(c => c.Id == id);
        }
    }
}

