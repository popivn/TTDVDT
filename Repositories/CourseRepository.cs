using Microsoft.EntityFrameworkCore;
using TTDVDTTNCXH.Data;
using TTDVDTTNCXH.Models;

namespace TTDVDTTNCXH.Repositories
{
    public class CourseRepository : ICourseRepository
    {
        private readonly AppDbContext _context;

        public CourseRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Course>> GetAllAsync()
        {
            return await _context.Courses
                .ToListAsync();
        }

        public async Task<Course?> GetByIdAsync(int id)
        {
            return await _context.Courses
                .Include(c => c.Classroom)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<List<Course>> GetByClassIdAsync(ulong classId)
        {
            return await _context.Courses
                .Include(c => c.Classroom)
                .Where(c => c.ClassId == classId)
                .ToListAsync();
        }

        public async Task<Course> CreateAsync(Course course)
        {
            course.CreatedAt = DateTime.UtcNow;
            _context.Courses.Add(course);
            await _context.SaveChangesAsync();
            return course;
        }

        public async Task<Course> UpdateAsync(Course course)
        {
            course.UpdatedAt = DateTime.UtcNow;
            _context.Courses.Update(course);
            await _context.SaveChangesAsync();
            return course;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null) return false;
            
            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}

