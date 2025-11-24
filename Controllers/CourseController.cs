using Microsoft.AspNetCore.Mvc;
using TTDVDTTNCXH.DTOs;
using TTDVDTTNCXH.Models;
using TTDVDTTNCXH.Services;

namespace TTDVDTTNCXH.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CourseController : ControllerBase
    {
        private readonly ICourseService _courseService;
        private readonly ILogger<CourseController> _logger;

        public CourseController(ICourseService courseService, ILogger<CourseController> logger)
        {
            _courseService = courseService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<CourseResponse>> GetAllCourses()
        {
            try
            {
                _logger.LogInformation("GetAllCourses request received");

                var result = await _courseService.GetAllCoursesAsync();

                if (!result.Success)
                {
                    _logger.LogWarning("GetAllCourses failed: {Message}", result.Message);
                    return BadRequest(result);
                }

                _logger.LogInformation("GetAllCourses successful. Count: {Count}", result.Courses?.Count ?? 0);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetAllCourses. Error: {ErrorMessage}", ex.Message);
                
                return StatusCode(500, new CourseResponse
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}"
                });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CourseResponse>> GetCourseById(int id)
        {
            try
            {
                _logger.LogInformation("GetCourseById request received for id: {Id}", id);

                var result = await _courseService.GetCourseByIdAsync(id);

                if (!result.Success)
                {
                    _logger.LogWarning("GetCourseById failed for id {Id}: {Message}", id, result.Message);
                    return NotFound(result);
                }

                _logger.LogInformation("GetCourseById successful for id: {Id}", id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetCourseById for id {Id}. Error: {ErrorMessage}", id, ex.Message);
                
                return StatusCode(500, new CourseResponse
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}"
                });
            }
        }

        [HttpGet("class/{classId}")]
        public async Task<ActionResult<CourseResponse>> GetCoursesByClassId(ulong classId)
        {
            try
            {
                _logger.LogInformation("GetCoursesByClassId request received for classId: {ClassId}", classId);

                var result = await _courseService.GetCoursesByClassIdAsync(classId);

                if (!result.Success)
                {
                    _logger.LogWarning("GetCoursesByClassId failed for classId {ClassId}: {Message}", classId, result.Message);
                    return BadRequest(result);
                }

                _logger.LogInformation("GetCoursesByClassId successful for classId: {ClassId}. Count: {Count}", classId, result.Courses?.Count ?? 0);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetCoursesByClassId for classId {ClassId}. Error: {ErrorMessage}", classId, ex.Message);
                
                return StatusCode(500, new CourseResponse
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}"
                });
            }
        }

        [HttpPost]
        public async Task<ActionResult<CourseResponse>> CreateCourse([FromBody] Course course)
        {
            try
            {
                _logger.LogInformation("CreateCourse request received");

                var result = await _courseService.CreateCourseAsync(course);

                if (!result.Success)
                {
                    _logger.LogWarning("CreateCourse failed: {Message}", result.Message);
                    return BadRequest(result);
                }

                _logger.LogInformation("CreateCourse successful. CourseId: {Id}", result.Course?.Id);
                return CreatedAtAction(nameof(GetCourseById), new { id = result.Course?.Id }, result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in CreateCourse. Error: {ErrorMessage}", ex.Message);
                
                return StatusCode(500, new CourseResponse
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}"
                });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<CourseResponse>> UpdateCourse(int id, [FromBody] Course course)
        {
            try
            {
                _logger.LogInformation("UpdateCourse request received for id: {Id}", id);

                var result = await _courseService.UpdateCourseAsync(id, course);

                if (!result.Success)
                {
                    _logger.LogWarning("UpdateCourse failed for id {Id}: {Message}", id, result.Message);
                    return NotFound(result);
                }

                _logger.LogInformation("UpdateCourse successful for id: {Id}", id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in UpdateCourse for id {Id}. Error: {ErrorMessage}", id, ex.Message);
                
                return StatusCode(500, new CourseResponse
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}"
                });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<CourseResponse>> DeleteCourse(int id)
        {
            try
            {
                _logger.LogInformation("DeleteCourse request received for id: {Id}", id);

                var result = await _courseService.DeleteCourseAsync(id);

                if (!result.Success)
                {
                    _logger.LogWarning("DeleteCourse failed for id {Id}: {Message}", id, result.Message);
                    return NotFound(result);
                }

                _logger.LogInformation("DeleteCourse successful for id: {Id}", id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in DeleteCourse for id {Id}. Error: {ErrorMessage}", id, ex.Message);
                
                return StatusCode(500, new CourseResponse
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}"
                });
            }
        }
    }
}

