using Microsoft.AspNetCore.Mvc;
using TTDVDTTNCXH.DTOs;
using TTDVDTTNCXH.Services;

namespace TTDVDTTNCXH.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SettingController : ControllerBase
    {
        private readonly ISettingService _settingService;
        private readonly ILogger<SettingController> _logger;

        public SettingController(ISettingService settingService, ILogger<SettingController> logger)
        {
            _settingService = settingService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<SettingResponse>> GetAllSettings()
        {
            try
            {
                _logger.LogInformation("GetAllSettings request received");

                var result = await _settingService.GetAllSettingsAsync();

                if (!result.Success)
                {
                    _logger.LogWarning("GetAllSettings failed: {Message}", result.Message);
                    return BadRequest(result);
                }

                _logger.LogInformation("GetAllSettings successful. Count: {Count}", result.Settings?.Count ?? 0);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetAllSettings. Error: {ErrorMessage}", ex.Message);
                
                return StatusCode(500, new SettingResponse
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}"
                });
            }
        }

        [HttpGet("{key}")]
        public async Task<ActionResult<SettingResponse>> GetSettingByKey(string key)
        {
            try
            {
                _logger.LogInformation("GetSettingByKey request received for key: {Key}", key);

                if (string.IsNullOrWhiteSpace(key))
                {
                    return BadRequest(new SettingResponse
                    {
                        Success = false,
                        Message = "Key cannot be empty"
                    });
                }

                var result = await _settingService.GetSettingByKeyAsync(key);

                if (!result.Success)
                {
                    _logger.LogWarning("GetSettingByKey failed for key {Key}: {Message}", key, result.Message);
                    return NotFound(result);
                }

                _logger.LogInformation("GetSettingByKey successful for key: {Key}", key);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetSettingByKey for key {Key}. Error: {ErrorMessage}", key, ex.Message);
                
                return StatusCode(500, new SettingResponse
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}"
                });
            }
        }
    }
}

