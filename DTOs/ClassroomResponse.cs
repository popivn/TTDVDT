using TTDVDTTNCXH.Models;

namespace TTDVDTTNCXH.DTOs
{
    public class ClassroomResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public List<Classroom>? Classrooms { get; set; }
        public Classroom? Classroom { get; set; }
    }
}

