namespace TTDVDTTNCXH.Models
{
    public class Course
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string? ImageUrl { get; set; }
        public decimal? Price { get; set; }
        public int? Duration { get; set; } // Duration in hours
        public string? Level { get; set; } // e.g., "Beginner", "Intermediate", "Advanced"
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}

