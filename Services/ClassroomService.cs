using TTDVDTTNCXH.DTOs;
using TTDVDTTNCXH.Repositories;

namespace TTDVDTTNCXH.Services
{
    public class ClassroomService : IClassroomService
    {
        private readonly IClassroomRepository _classroomRepository;

        public ClassroomService(IClassroomRepository classroomRepository)
        {
            _classroomRepository = classroomRepository;
        }

        public async Task<ClassroomResponse> GetAllClassroomsAsync()
        {
            try
            {
                var classrooms = await _classroomRepository.GetAllAsync();
                
                return new ClassroomResponse
                {
                    Success = true,
                    Message = "Classrooms retrieved successfully",
                    Classrooms = classrooms
                };
            }
            catch (Exception ex)
            {
                return new ClassroomResponse
                {
                    Success = false,
                    Message = $"Error retrieving classrooms: {ex.Message}",
                    Classrooms = null
                };
            }
        }

        public async Task<ClassroomResponse> GetClassroomByIdAsync(ulong id)
        {
            try
            {
                var classroom = await _classroomRepository.GetByIdAsync(id);
                
                if (classroom == null)
                {
                    return new ClassroomResponse
                    {
                        Success = false,
                        Message = $"Classroom with id '{id}' not found",
                        Classroom = null
                    };
                }

                return new ClassroomResponse
                {
                    Success = true,
                    Message = "Classroom retrieved successfully",
                    Classroom = classroom
                };
            }
            catch (Exception ex)
            {
                return new ClassroomResponse
                {
                    Success = false,
                    Message = $"Error retrieving classroom: {ex.Message}",
                    Classroom = null
                };
            }
        }
    }
}

