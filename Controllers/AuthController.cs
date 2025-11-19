using Microsoft.AspNetCore.Mvc;
using TTDVDTTNCXH.DTOs;
using TTDVDTTNCXH.Services;

namespace TTDVDTTNCXH.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IUserService userService, ILogger<AuthController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<ActionResult<RegisterResponse>> Register([FromBody] RegisterRequest request)
        {
            try
            {
                _logger.LogInformation("Register request received for email: {Email}", request?.Email);

                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Invalid model state: {ModelState}", ModelState);
                    return BadRequest(ModelState);
                }

                var result = await _userService.RegisterAsync(request!);

                if (!result.Success)
                {
                    _logger.LogWarning("Registration failed: {Message}", result.Message);
                    return BadRequest(result);
                }

                _logger.LogInformation("Registration successful for user: {UserId}", result.UserId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error registering user. Email: {Email}, Error: {ErrorMessage}", 
                    request?.Email, ex.Message);
                
                return StatusCode(500, new RegisterResponse
                {
                    Success = false,
                    Message = $"Đã xảy ra lỗi: {ex.Message}"
                });
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
        {
            try
            {
                _logger.LogInformation("Login request received for email: {Email}", request?.Email);

                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Invalid model state: {ModelState}", ModelState);
                    return BadRequest(ModelState);
                }

                var result = await _userService.LoginAsync(request!);

                if (!result.Success)
                {
                    _logger.LogWarning("Login failed: {Message}", result.Message);
                    return BadRequest(result);
                }

                _logger.LogInformation("Login successful for user: {UserId}", result.UserId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error logging in user. Email: {Email}, Error: {ErrorMessage}", 
                    request?.Email, ex.Message);
                
                return StatusCode(500, new LoginResponse
                {
                    Success = false,
                    Message = $"Đã xảy ra lỗi: {ex.Message}"
                });
            }
        }
    }
}

