using TTDVDTTNCXH.Models;

namespace TTDVDTTNCXH.Repositories
{
    public interface ISettingRepository
    {
        Task<List<Setting>> GetAllAsync();
        Task<Setting?> GetByKeyAsync(string key);
        Task<Dictionary<string, string>> GetAllAsDictionaryAsync();
    }
}

