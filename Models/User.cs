namespace TTDVDTTNCXH.Models
{
    public class User
    {
        public int Id { get; set; }             // Primary key
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
