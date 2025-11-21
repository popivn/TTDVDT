using Microsoft.AspNetCore.Mvc;
using TTDVDTTNCXH.DTOs;
using TTDVDTTNCXH.Services;

namespace TTDVDTTNCXH.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FacultyController : ControllerBase
    {
        private readonly IFacultyService _facultyService;
        private readonly ILogger<FacultyController> _logger;

        public FacultyController(IFacultyService facultyService, ILogger<FacultyController> logger)
        {
            _facultyService = facultyService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<FacultyResponse>> GetAllFaculties()
        {
            try
            {
                _logger.LogInformation("GetAllFaculties request received");

                var result = await _facultyService.GetAllFacultiesAsync();

                if (!result.Success)
                {
                    _logger.LogWarning("GetAllFaculties failed: {Message}", result.Message);
                    return BadRequest(result);
                }

                _logger.LogInformation("GetAllFaculties successful. Count: {Count}", result.Faculties?.Count ?? 0);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetAllFaculties. Error: {ErrorMessage}", ex.Message);
                
                return StatusCode(500, new FacultyResponse
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}"
                });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FacultyResponse>> GetFacultyById(ulong id)
        {
            try
            {
                _logger.LogInformation("GetFacultyById request received for id: {Id}", id);

                var result = await _facultyService.GetFacultyByIdAsync(id);

                if (!result.Success)
                {
                    _logger.LogWarning("GetFacultyById failed for id {Id}: {Message}", id, result.Message);
                    return NotFound(result);
                }

                _logger.LogInformation("GetFacultyById successful for id: {Id}", id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetFacultyById for id {Id}. Error: {ErrorMessage}", id, ex.Message);
                
                return StatusCode(500, new FacultyResponse
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}"
                });
            }
        }
    }
}

