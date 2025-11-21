using System.ComponentModel.DataAnnotations.Schema;

namespace TTDVDTTNCXH.Models
{
    public class Classroom
    {
        public ulong Id { get; set; } // bigint unsigned, auto_increment, primary key
        
        public string ClassroomName { get; set; } = null!; // varchar(255), NOT NULL, UNIQUE
        
        public string? Description { get; set; } // nullable
        
        public int? Capacity { get; set; } // nullable
        
        public string? ImageUrl { get; set; } // nullable
        
        public DateTime? CreatedAt { get; set; } // timestamp, nullable
        
        public DateTime? UpdatedAt { get; set; } // timestamp, nullable
    }
}
