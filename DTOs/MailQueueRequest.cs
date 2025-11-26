namespace TTDVDTTNCXH.DTOs
{
    public class MailQueueRequest
    {
        public string Time { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public string? Cc { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Receivers { get; set; } = string.Empty;
    }
}

