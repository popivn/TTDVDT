using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using TTDVDTTNCXH.DTOs;
using TTDVDTTNCXH.Services;
using TTDVDTTNCXH.Attributes;

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
        [RequireApiKey]
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
        [RequireApiKey]
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

        [HttpGet("validate")]
        [Authorize]
        public IActionResult Validate()
        {
            _logger.LogDebug("Starting token validation. User claims: {Claims}", 
                string.Join(", ", User.Claims.Select(c => $"{c.Type}={c.Value}")));

            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
                {
                    _logger.LogDebug("Token invalid: userIdClaim missing or not an integer. Value: {UserIdClaim}", userIdClaim);
                    return Ok(new ValidateTokenResponse
                    {
                        Success = false,
                        Message = "Token không hợp lệ"
                    });
                }

                _logger.LogDebug("Token valid. UserId: {UserId}", userId);
                return Ok(new ValidateTokenResponse
                {
                    Success = true,
                    UserId = userId
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating token");
                return Ok(new ValidateTokenResponse
                {
                    Success = false,
                    Message = "Lỗi khi validate token"
                });
            }
        }
    }
}

