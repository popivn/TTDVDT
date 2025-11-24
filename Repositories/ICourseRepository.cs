using TTDVDTTNCXH.Models;

namespace TTDVDTTNCXH.Repositories
{
    public interface ICourseRepository
    {
        Task<List<Course>> GetAllAsync();
        Task<Course?> GetByIdAsync(int id);
        Task<List<Course>> GetByClassIdAsync(ulong classId);
        Task<Course> CreateAsync(Course course);
        Task<Course> UpdateAsync(Course course);
        Task<bool> DeleteAsync(int id);
    }
}

