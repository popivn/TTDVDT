using TTDVDTTNCXH.Models;

namespace TTDVDTTNCXH.DTOs
{
    public class FacultyResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public List<Faculty>? Faculties { get; set; }
        public Faculty? Faculty { get; set; }
    }
}

