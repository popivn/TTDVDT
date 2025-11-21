using TTDVDTTNCXH.DTOs;

namespace TTDVDTTNCXH.Services
{
    public interface IFacultyService
    {
        Task<FacultyResponse> GetAllFacultiesAsync();
        Task<FacultyResponse> GetFacultyByIdAsync(ulong id);
    }
}

