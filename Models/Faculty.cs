using System.ComponentModel.DataAnnotations.Schema;

namespace TTDVDTTNCXH.Models
{
    public class Faculty
    {
        public ulong Id { get; set; } // bigint unsigned, auto_increment, primary key
        
        [Column("ten_khoa")]
        public string FacultyName { get; set; } = null!; // varchar(255), NOT NULL, UNIQUE
        
        public DateTime? CreatedAt { get; set; } // timestamp, nullable
        
        public DateTime? UpdatedAt { get; set; } // timestamp, nullable
        
        public string? ImageUrl { get; set; } // nullable
        
        public string? Description { get; set; } // nullable
    }
}

