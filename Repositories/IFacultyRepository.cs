using TTDVDTTNCXH.Models;

namespace TTDVDTTNCXH.Repositories
{
    public interface IFacultyRepository
    {
        Task<List<Faculty>> GetAllAsync();
        Task<Faculty?> GetByIdAsync(ulong id);
    }
}

