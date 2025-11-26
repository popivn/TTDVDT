namespace TTDVDTTNCXH.DTOs
{
    public class RegistrationRequest
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public ulong ClassroomId { get; set; }
        public int CourseId { get; set; }
        public string? Note { get; set; }
    }
}

