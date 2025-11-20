using TTDVDTTNCXH.DTOs;
using TTDVDTTNCXH.Repositories;

namespace TTDVDTTNCXH.Services
{
    public class SettingService : ISettingService
    {
        private readonly ISettingRepository _settingRepository;

        public SettingService(ISettingRepository settingRepository)
        {
            _settingRepository = settingRepository;
        }

        public async Task<SettingResponse> GetAllSettingsAsync()
        {
            try
            {
                var settings = await _settingRepository.GetAllAsDictionaryAsync();
                
                return new SettingResponse
                {
                    Success = true,
                    Message = "Settings retrieved successfully",
                    Settings = settings
                };
            }
            catch (Exception ex)
            {
                return new SettingResponse
                {
                    Success = false,
                    Message = $"Error retrieving settings: {ex.Message}",
                    Settings = null
                };
            }
        }

        public async Task<SettingResponse> GetSettingByKeyAsync(string key)
        {
            try
            {
                var setting = await _settingRepository.GetByKeyAsync(key);
                
                if (setting == null)
                {
                    return new SettingResponse
                    {
                        Success = false,
                        Message = $"Setting with key '{key}' not found",
                        Setting = null
                    };
                }

                return new SettingResponse
                {
                    Success = true,
                    Message = "Setting retrieved successfully",
                    Setting = new SettingItem
                    {
                        Key = setting.Key,
                        Value = setting.Value
                    }
                };
            }
            catch (Exception ex)
            {
                return new SettingResponse
                {
                    Success = false,
                    Message = $"Error retrieving setting: {ex.Message}",
                    Setting = null
                };
            }
        }
    }
}

