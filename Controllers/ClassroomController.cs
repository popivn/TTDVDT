using Microsoft.AspNetCore.Mvc;
using TTDVDTTNCXH.DTOs;
using TTDVDTTNCXH.Services;

namespace TTDVDTTNCXH.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClassroomController : ControllerBase
    {
        private readonly IClassroomService _classroomService;
        private readonly ILogger<ClassroomController> _logger;

        public ClassroomController(IClassroomService classroomService, ILogger<ClassroomController> logger)
        {
            _classroomService = classroomService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<ClassroomResponse>> GetAllClassrooms()
        {
            try
            {
                _logger.LogInformation("GetAllClassrooms request received");

                var result = await _classroomService.GetAllClassroomsAsync();

                if (!result.Success)
                {
                    _logger.LogWarning("GetAllClassrooms failed: {Message}", result.Message);
                    return BadRequest(result);
                }

                _logger.LogInformation("GetAllClassrooms successful. Count: {Count}", result.Classrooms?.Count ?? 0);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetAllClassrooms. Error: {ErrorMessage}", ex.Message);
                
                return StatusCode(500, new ClassroomResponse
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}"
                });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ClassroomResponse>> GetClassroomById(ulong id)
        {
            try
            {
                _logger.LogInformation("GetClassroomById request received for id: {Id}", id);

                var result = await _classroomService.GetClassroomByIdAsync(id);

                if (!result.Success)
                {
                    _logger.LogWarning("GetClassroomById failed for id {Id}: {Message}", id, result.Message);
                    return NotFound(result);
                }

                _logger.LogInformation("GetClassroomById successful for id: {Id}", id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetClassroomById for id {Id}. Error: {ErrorMessage}", id, ex.Message);
                
                return StatusCode(500, new ClassroomResponse
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}"
                });
            }
        }
    }
}

