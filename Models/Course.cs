using System.ComponentModel.DataAnnotations.Schema;

namespace TTDVDTTNCXH.Models
{
    public class Course
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public int Duration { get; set; } // Số tiết
        public decimal Tuition { get; set; }
        public ulong ClassId { get; set; } // Foreign key đến Classroom
        
        // Navigation property
        [ForeignKey("ClassId")]
        public Classroom? Classroom { get; set; }
        
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}

