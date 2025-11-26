namespace TTDVDTTNCXH.DTOs
{
    public class MailQueueResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? Response { get; set; }
        public int? HttpCode { get; set; }
        public string? Error { get; set; }
    }
}

