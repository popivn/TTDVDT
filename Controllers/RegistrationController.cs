using Microsoft.AspNetCore.Mvc;
using TTDVDTTNCXH.DTOs;
using TTDVDTTNCXH.Services;

namespace TTDVDTTNCXH.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegistrationController : ControllerBase
    {
        private readonly IRegistrationService _registrationService;
        private readonly ILogger<RegistrationController> _logger;

        public RegistrationController(IRegistrationService registrationService, ILogger<RegistrationController> logger)
        {
            _registrationService = registrationService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<RegistrationResponse>> GetAllRegistrations()
        {
            try
            {
                _logger.LogInformation("GetAllRegistrations request received");

                var result = await _registrationService.GetAllRegistrationsAsync();

                if (!result.Success)
                {
                    _logger.LogWarning("GetAllRegistrations failed: {Message}", result.Message);
                    return BadRequest(result);
                }

                _logger.LogInformation("GetAllRegistrations successful. Count: {Count}", result.Registrations?.Count ?? 0);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetAllRegistrations. Error: {ErrorMessage}", ex.Message);
                
                return StatusCode(500, new RegistrationResponse
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}"
                });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RegistrationResponse>> GetRegistrationById(ulong id)
        {
            try
            {
                _logger.LogInformation("GetRegistrationById request received for id: {Id}", id);

                var result = await _registrationService.GetRegistrationByIdAsync(id);

                if (!result.Success)
                {
                    _logger.LogWarning("GetRegistrationById failed for id {Id}: {Message}", id, result.Message);
                    return NotFound(result);
                }

                _logger.LogInformation("GetRegistrationById successful for id: {Id}", id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetRegistrationById for id {Id}. Error: {ErrorMessage}", id, ex.Message);
                
                return StatusCode(500, new RegistrationResponse
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}"
                });
            }
        }

        [HttpPost]
        public async Task<ActionResult<RegistrationResponse>> CreateRegistration([FromBody] RegistrationRequest request)
        {
            try
            {
                _logger.LogInformation("CreateRegistration request received for email: {Email}", request?.Email);

                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Invalid model state: {ModelState}", ModelState);
                    return BadRequest(ModelState);
                }

                var result = await _registrationService.CreateRegistrationAsync(request!);

                if (!result.Success)
                {
                    _logger.LogWarning("CreateRegistration failed: {Message}", result.Message);
                    return BadRequest(result);
                }

                _logger.LogInformation("CreateRegistration successful for id: {Id}", result.Registration?.Id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in CreateRegistration. Error: {ErrorMessage}", ex.Message);
                
                return StatusCode(500, new RegistrationResponse
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}"
                });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<RegistrationResponse>> DeleteRegistration(ulong id)
        {
            try
            {
                _logger.LogInformation("DeleteRegistration request received for id: {Id}", id);

                var result = await _registrationService.DeleteRegistrationAsync(id);

                if (!result.Success)
                {
                    _logger.LogWarning("DeleteRegistration failed for id {Id}: {Message}", id, result.Message);
                    return NotFound(result);
                }

                _logger.LogInformation("DeleteRegistration successful for id: {Id}", id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in DeleteRegistration for id {Id}. Error: {ErrorMessage}", id, ex.Message);
                
                return StatusCode(500, new RegistrationResponse
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}"
                });
            }
        }
    }
}

