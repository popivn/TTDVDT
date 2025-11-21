using TTDVDTTNCXH.DTOs;

namespace TTDVDTTNCXH.Services
{
    public interface IClassroomService
    {
        Task<ClassroomResponse> GetAllClassroomsAsync();
        Task<ClassroomResponse> GetClassroomByIdAsync(ulong id);
    }
}

