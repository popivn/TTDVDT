namespace TTDVDTTNCXH.DTOs
{
    public class LoginResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = null!;
        public int? UserId { get; set; }
        public string? Token { get; set; }
    }
}

