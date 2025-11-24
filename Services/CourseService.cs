using TTDVDTTNCXH.DTOs;
using TTDVDTTNCXH.Models;
using TTDVDTTNCXH.Repositories;

namespace TTDVDTTNCXH.Services
{
    public class CourseService : ICourseService
    {
        private readonly ICourseRepository _courseRepository;

        public CourseService(ICourseRepository courseRepository)
        {
            _courseRepository = courseRepository;
        }

        public async Task<CourseResponse> GetAllCoursesAsync()
        {
            try
            {
                var courses = await _courseRepository.GetAllAsync();
                
                return new CourseResponse
                {
                    Success = true,
                    Message = "Courses retrieved successfully",
                    Courses = courses
                };
            }
            catch (Exception ex)
            {
                return new CourseResponse
                {
                    Success = false,
                    Message = $"Error retrieving courses: {ex.Message}",
                    Courses = null
                };
            }
        }

        public async Task<CourseResponse> GetCourseByIdAsync(int id)
        {
            try
            {
                var course = await _courseRepository.GetByIdAsync(id);
                
                if (course == null)
                {
                    return new CourseResponse
                    {
                        Success = false,
                        Message = $"Course with id '{id}' not found",
                        Course = null
                    };
                }

                return new CourseResponse
                {
                    Success = true,
                    Message = "Course retrieved successfully",
                    Course = course
                };
            }
            catch (Exception ex)
            {
                return new CourseResponse
                {
                    Success = false,
                    Message = $"Error retrieving course: {ex.Message}",
                    Course = null
                };
            }
        }

        public async Task<CourseResponse> GetCoursesByClassIdAsync(ulong classId)
        {
            try
            {
                var courses = await _courseRepository.GetByClassIdAsync(classId);
                
                return new CourseResponse
                {
                    Success = true,
                    Message = "Courses retrieved successfully",
                    Courses = courses
                };
            }
            catch (Exception ex)
            {
                return new CourseResponse
                {
                    Success = false,
                    Message = $"Error retrieving courses: {ex.Message}",
                    Courses = null
                };
            }
        }

        public async Task<CourseResponse> CreateCourseAsync(Course course)
        {
            try
            {
                var createdCourse = await _courseRepository.CreateAsync(course);
                
                return new CourseResponse
                {
                    Success = true,
                    Message = "Course created successfully",
                    Course = createdCourse
                };
            }
            catch (Exception ex)
            {
                return new CourseResponse
                {
                    Success = false,
                    Message = $"Error creating course: {ex.Message}",
                    Course = null
                };
            }
        }

        public async Task<CourseResponse> UpdateCourseAsync(int id, Course course)
        {
            try
            {
                var existingCourse = await _courseRepository.GetByIdAsync(id);
                if (existingCourse == null)
                {
                    return new CourseResponse
                    {
                        Success = false,
                        Message = $"Course with id '{id}' not found",
                        Course = null
                    };
                }

                existingCourse.Name = course.Name;
                existingCourse.Duration = course.Duration;
                existingCourse.Tuition = course.Tuition;
                existingCourse.ClassId = course.ClassId;

                var updatedCourse = await _courseRepository.UpdateAsync(existingCourse);
                
                return new CourseResponse
                {
                    Success = true,
                    Message = "Course updated successfully",
                    Course = updatedCourse
                };
            }
            catch (Exception ex)
            {
                return new CourseResponse
                {
                    Success = false,
                    Message = $"Error updating course: {ex.Message}",
                    Course = null
                };
            }
        }

        public async Task<CourseResponse> DeleteCourseAsync(int id)
        {
            try
            {
                var deleted = await _courseRepository.DeleteAsync(id);
                
                if (!deleted)
                {
                    return new CourseResponse
                    {
                        Success = false,
                        Message = $"Course with id '{id}' not found",
                        Course = null
                    };
                }

                return new CourseResponse
                {
                    Success = true,
                    Message = "Course deleted successfully",
                    Course = null
                };
            }
            catch (Exception ex)
            {
                return new CourseResponse
                {
                    Success = false,
                    Message = $"Error deleting course: {ex.Message}",
                    Course = null
                };
            }
        }
    }
}

