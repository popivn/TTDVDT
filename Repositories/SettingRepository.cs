using Microsoft.EntityFrameworkCore;
using TTDVDTTNCXH.Data;
using TTDVDTTNCXH.Models;

namespace TTDVDTTNCXH.Repositories
{
    public class SettingRepository : ISettingRepository
    {
        private readonly AppDbContext _context;

        public SettingRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Setting>> GetAllAsync()
        {
            return await _context.Settings.ToListAsync();
        }

        public async Task<Setting?> GetByKeyAsync(string key)
        {
            return await _context.Settings
                .FirstOrDefaultAsync(s => s.Key == key);
        }

        public async Task<Dictionary<string, string>> GetAllAsDictionaryAsync()
        {
            var settings = await GetAllAsync();
            return settings.ToDictionary(s => s.Key, s => s.Value);
        }
    }
}

