using TTDVDTTNCXH.DTOs;
using TTDVDTTNCXH.Models;
using TTDVDTTNCXH.Repositories;
using System.Security.Cryptography;
using System.Text;

namespace TTDVDTTNCXH.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<RegisterResponse> RegisterAsync(RegisterRequest request)
        {
            // Kiểm tra email đã tồn tại chưa
            if (await _userRepository.EmailExistsAsync(request.Email))
            {
                return new RegisterResponse
                {
                    Success = false,
                    Message = "Email đã được sử dụng"
                };
            }

            // Hash password (sử dụng SHA256 đơn giản, nên dùng BCrypt trong production)
            var hashedPassword = HashPassword(request.Password);

            // Tạo user mới
            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                Password = hashedPassword,
                CreatedAt = DateTime.UtcNow
            };

            // Lưu vào database
            var createdUser = await _userRepository.CreateAsync(user);

            return new RegisterResponse
            {
                Success = true,
                Message = "Đăng ký thành công",
                UserId = createdUser.Id
            };
        }

        public async Task<LoginResponse> LoginAsync(LoginRequest request)
        {
            // Tìm user theo email
            var user = await _userRepository.GetByEmailAsync(request.Email);
            
            if (user == null)
            {
                return new LoginResponse
                {
                    Success = false,
                    Message = "Email hoặc mật khẩu không đúng"
                };
            }

            // Hash password để so sánh
            var hashedPassword = HashPassword(request.Password);
            
            if (user.Password != hashedPassword)
            {
                return new LoginResponse
                {
                    Success = false,
                    Message = "Email hoặc mật khẩu không đúng"
                };
            }

            return new LoginResponse
            {
                Success = true,
                Message = "Đăng nhập thành công",
                UserId = user.Id,
                Token = null // TODO: Implement JWT token
            };
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }
    }
}

