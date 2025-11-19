using TTDVDTTNCXH.DTOs;

namespace TTDVDTTNCXH.Services
{
    public interface IUserService
    {
        Task<RegisterResponse> RegisterAsync(RegisterRequest request);
        Task<LoginResponse> LoginAsync(LoginRequest request);
    }
}

