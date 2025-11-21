using TTDVDTTNCXH.DTOs;
using TTDVDTTNCXH.Repositories;

namespace TTDVDTTNCXH.Services
{
    public class FacultyService : IFacultyService
    {
        private readonly IFacultyRepository _facultyRepository;

        public FacultyService(IFacultyRepository facultyRepository)
        {
            _facultyRepository = facultyRepository;
        }

        public async Task<FacultyResponse> GetAllFacultiesAsync()
        {
            try
            {
                var faculties = await _facultyRepository.GetAllAsync();
                
                return new FacultyResponse
                {
                    Success = true,
                    Message = "Faculties retrieved successfully",
                    Faculties = faculties
                };
            }
            catch (Exception ex)
            {
                return new FacultyResponse
                {
                    Success = false,
                    Message = $"Error retrieving faculties: {ex.Message}",
                    Faculties = null
                };
            }
        }

        public async Task<FacultyResponse> GetFacultyByIdAsync(ulong id)
        {
            try
            {
                var faculty = await _facultyRepository.GetByIdAsync(id);
                
                if (faculty == null)
                {
                    return new FacultyResponse
                    {
                        Success = false,
                        Message = $"Faculty with id '{id}' not found",
                        Faculty = null
                    };
                }

                return new FacultyResponse
                {
                    Success = true,
                    Message = "Faculty retrieved successfully",
                    Faculty = faculty
                };
            }
            catch (Exception ex)
            {
                return new FacultyResponse
                {
                    Success = false,
                    Message = $"Error retrieving faculty: {ex.Message}",
                    Faculty = null
                };
            }
        }
    }
}

