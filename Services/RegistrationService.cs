using TTDVDTTNCXH.DTOs;
using TTDVDTTNCXH.Models;
using TTDVDTTNCXH.Repositories;

namespace TTDVDTTNCXH.Services
{
    public class RegistrationService : IRegistrationService
    {
        private readonly IRegistrationRepository _registrationRepository;

        public RegistrationService(IRegistrationRepository registrationRepository)
        {
            _registrationRepository = registrationRepository;
        }

        public async Task<RegistrationResponse> GetAllRegistrationsAsync()
        {
            try
            {
                var registrations = await _registrationRepository.GetAllAsync();
                
                var registrationDtos = registrations.Select(r => new RegistrationDto
                {
                    Id = r.Id,
                    FullName = r.FullName,
                    Email = r.Email,
                    PhoneNumber = r.PhoneNumber,
                    ClassroomId = r.ClassroomId,
                    ClassroomName = r.Classroom?.ClassroomName ?? "N/A",
                    CourseId = r.CourseId,
                    CourseName = r.Course?.Name ?? "N/A",
                    Note = r.Note,
                    CreatedAt = r.CreatedAt,
                    UpdatedAt = r.UpdatedAt
                }).ToList();

                return new RegistrationResponse
                {
                    Success = true,
                    Message = "Registrations retrieved successfully",
                    Registrations = registrationDtos
                };
            }
            catch (Exception ex)
            {
                return new RegistrationResponse
                {
                    Success = false,
                    Message = $"Error retrieving registrations: {ex.Message}",
                    Registrations = null
                };
            }
        }

        public async Task<RegistrationResponse> GetRegistrationByIdAsync(ulong id)
        {
            try
            {
                var registration = await _registrationRepository.GetByIdAsync(id);
                
                if (registration == null)
                {
                    return new RegistrationResponse
                    {
                        Success = false,
                        Message = $"Registration with id '{id}' not found",
                        Registration = null
                    };
                }

                var registrationDto = new RegistrationDto
                {
                    Id = registration.Id,
                    FullName = registration.FullName,
                    Email = registration.Email,
                    PhoneNumber = registration.PhoneNumber,
                    ClassroomId = registration.ClassroomId,
                    ClassroomName = registration.Classroom?.ClassroomName ?? "N/A",
                    CourseId = registration.CourseId,
                    CourseName = registration.Course?.Name ?? "N/A",
                    Note = registration.Note,
                    CreatedAt = registration.CreatedAt,
                    UpdatedAt = registration.UpdatedAt
                };

                return new RegistrationResponse
                {
                    Success = true,
                    Message = "Registration retrieved successfully",
                    Registration = registrationDto
                };
            }
            catch (Exception ex)
            {
                return new RegistrationResponse
                {
                    Success = false,
                    Message = $"Error retrieving registration: {ex.Message}",
                    Registration = null
                };
            }
        }

        public async Task<RegistrationResponse> CreateRegistrationAsync(RegistrationRequest request)
        {
            try
            {
                var registration = new Registration
                {
                    FullName = request.FullName,
                    Email = request.Email,
                    PhoneNumber = request.PhoneNumber,
                    ClassroomId = request.ClassroomId,
                    CourseId = request.CourseId,
                    Note = request.Note
                };

                var createdRegistration = await _registrationRepository.CreateAsync(registration);
                
                // Reload with navigation properties
                var registrationWithNav = await _registrationRepository.GetByIdAsync(createdRegistration.Id);

                var registrationDto = new RegistrationDto
                {
                    Id = registrationWithNav!.Id,
                    FullName = registrationWithNav.FullName,
                    Email = registrationWithNav.Email,
                    PhoneNumber = registrationWithNav.PhoneNumber,
                    ClassroomId = registrationWithNav.ClassroomId,
                    ClassroomName = registrationWithNav.Classroom?.ClassroomName ?? "N/A",
                    CourseId = registrationWithNav.CourseId,
                    CourseName = registrationWithNav.Course?.Name ?? "N/A",
                    Note = registrationWithNav.Note,
                    CreatedAt = registrationWithNav.CreatedAt,
                    UpdatedAt = registrationWithNav.UpdatedAt
                };

                return new RegistrationResponse
                {
                    Success = true,
                    Message = "Registration created successfully",
                    Registration = registrationDto
                };
            }
            catch (Exception ex)
            {
                return new RegistrationResponse
                {
                    Success = false,
                    Message = $"Error creating registration: {ex.Message}",
                    Registration = null
                };
            }
        }

        public async Task<RegistrationResponse> DeleteRegistrationAsync(ulong id)
        {
            try
            {
                var deleted = await _registrationRepository.DeleteAsync(id);
                
                if (!deleted)
                {
                    return new RegistrationResponse
                    {
                        Success = false,
                        Message = $"Registration with id '{id}' not found",
                        Registration = null
                    };
                }

                return new RegistrationResponse
                {
                    Success = true,
                    Message = "Registration deleted successfully",
                    Registration = null
                };
            }
            catch (Exception ex)
            {
                return new RegistrationResponse
                {
                    Success = false,
                    Message = $"Error deleting registration: {ex.Message}",
                    Registration = null
                };
            }
        }
    }
}

