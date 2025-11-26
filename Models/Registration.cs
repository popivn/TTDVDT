using System.ComponentModel.DataAnnotations.Schema;

namespace TTDVDTTNCXH.Models
{
    public class Registration
    {
        public ulong Id { get; set; } // bigint unsigned, auto_increment, primary key
        
        public string FullName { get; set; } = null!; // varchar(255), NOT NULL
        
        public string Email { get; set; } = null!; // varchar(255), NOT NULL
        
        public string PhoneNumber { get; set; } = null!; // varchar(20), NOT NULL
        
        public ulong ClassroomId { get; set; } // Foreign key đến Classroom
        
        public int CourseId { get; set; } // Foreign key đến Course
        
        public string? Note { get; set; } // nullable
        
        public DateTime? CreatedAt { get; set; } // timestamp, nullable
        
        public DateTime? UpdatedAt { get; set; } // timestamp, nullable
        
        // Navigation properties
        [ForeignKey("ClassroomId")]
        public Classroom? Classroom { get; set; }
        
        [ForeignKey("CourseId")]
        public Course? Course { get; set; }
    }
}

