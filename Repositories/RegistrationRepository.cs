using Microsoft.EntityFrameworkCore;
using TTDVDTTNCXH.Data;
using TTDVDTTNCXH.Models;

namespace TTDVDTTNCXH.Repositories
{
    public class RegistrationRepository : IRegistrationRepository
    {
        private readonly AppDbContext _context;

        public RegistrationRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Registration>> GetAllAsync()
        {
            return await _context.Registrations
                .Include(r => r.Classroom)
                .Include(r => r.Course)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<Registration?> GetByIdAsync(ulong id)
        {
            return await _context.Registrations
                .Include(r => r.Classroom)
                .Include(r => r.Course)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<Registration> CreateAsync(Registration registration)
        {
            registration.CreatedAt = DateTime.UtcNow;
            registration.UpdatedAt = DateTime.UtcNow;
            
            _context.Registrations.Add(registration);
            await _context.SaveChangesAsync();
            return registration;
        }

        public async Task<bool> DeleteAsync(ulong id)
        {
            var registration = await _context.Registrations.FindAsync(id);
            if (registration == null)
            {
                return false;
            }

            _context.Registrations.Remove(registration);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}

