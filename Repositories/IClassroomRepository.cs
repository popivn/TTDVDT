using TTDVDTTNCXH.Models;

namespace TTDVDTTNCXH.Repositories
{
    public interface IClassroomRepository
    {
        Task<List<Classroom>> GetAllAsync();
        Task<Classroom?> GetByIdAsync(ulong id);
    }
}

