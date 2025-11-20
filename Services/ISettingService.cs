using TTDVDTTNCXH.DTOs;

namespace TTDVDTTNCXH.Services
{
    public interface ISettingService
    {
        Task<SettingResponse> GetAllSettingsAsync();
        Task<SettingResponse> GetSettingByKeyAsync(string key);
    }
}

