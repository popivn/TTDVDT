namespace TTDVDTTNCXH.DTOs
{
    public class SettingResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public Dictionary<string, string>? Settings { get; set; }
        public SettingItem? Setting { get; set; }
    }

    public class SettingItem
    {
        public string Key { get; set; } = null!;
        public string Value { get; set; } = null!;
    }
}

