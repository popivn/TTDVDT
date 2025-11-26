namespace TTDVDTTNCXH.DTOs
{
    public class RegistrationResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public RegistrationDto? Registration { get; set; }
        public List<RegistrationDto>? Registrations { get; set; }
    }
}

