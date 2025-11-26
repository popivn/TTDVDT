using TTDVDTTNCXH.Models;

namespace TTDVDTTNCXH.Repositories
{
    public interface IRegistrationRepository
    {
        Task<List<Registration>> GetAllAsync();
        Task<Registration?> GetByIdAsync(ulong id);
        Task<Registration> CreateAsync(Registration registration);
        Task<bool> DeleteAsync(ulong id);
    }
}

