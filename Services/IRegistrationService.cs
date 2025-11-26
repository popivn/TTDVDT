using TTDVDTTNCXH.DTOs;

namespace TTDVDTTNCXH.Services
{
    public interface IRegistrationService
    {
        Task<RegistrationResponse> GetAllRegistrationsAsync();
        Task<RegistrationResponse> GetRegistrationByIdAsync(ulong id);
        Task<RegistrationResponse> CreateRegistrationAsync(RegistrationRequest request);
        Task<RegistrationResponse> DeleteRegistrationAsync(ulong id);
    }
}

