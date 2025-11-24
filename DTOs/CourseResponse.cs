using TTDVDTTNCXH.Models;

namespace TTDVDTTNCXH.DTOs
{
    public class CourseResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public List<Course>? Courses { get; set; }
        public Course? Course { get; set; }
    }
}

