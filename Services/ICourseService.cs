using TTDVDTTNCXH.DTOs;
using TTDVDTTNCXH.Models;

namespace TTDVDTTNCXH.Services
{
    public interface ICourseService
    {
        Task<CourseResponse> GetAllCoursesAsync();
        Task<CourseResponse> GetCourseByIdAsync(int id);
        Task<CourseResponse> GetCoursesByClassIdAsync(ulong classId);
        Task<CourseResponse> CreateCourseAsync(Course course);
        Task<CourseResponse> UpdateCourseAsync(int id, Course course);
        Task<CourseResponse> DeleteCourseAsync(int id);
    }
}

