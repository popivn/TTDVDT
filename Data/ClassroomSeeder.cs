using Microsoft.EntityFrameworkCore;
using TTDVDTTNCXH.Models;

namespace TTDVDTTNCXH.Data
{
    public static class ClassroomSeeder
    {
        public static async Task SeedAsync(AppDbContext context)
        {
            // Check if any classrooms already exist
            if (await context.Classrooms.AnyAsync())
            {
                return; // Data already seeded
            }

            var classrooms = new List<Classroom>
            {
                new Classroom
                {
                    ClassroomName = "Classroom A101",
                    Description = "Main lecture hall with projector and sound system. Suitable for large group lectures.",
                    Capacity = 50,
                    ImageUrl = "/assets/imgs/classroom.jpg",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = null
                },
                new Classroom
                {
                    ClassroomName = "Classroom A102",
                    Description = "Standard classroom with whiteboard and multimedia equipment. Ideal for regular classes.",
                    Capacity = 30,
                    ImageUrl = "/assets/imgs/classroom.jpg",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = null
                },
                new Classroom
                {
                    ClassroomName = "Lab B205",
                    Description = "Computer laboratory with 40 workstations. Equipped with latest software and high-speed internet.",
                    Capacity = 40,
                    ImageUrl = "/assets/imgs/classroom.jpg",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = null
                },
                new Classroom
                {
                    ClassroomName = "Classroom C301",
                    Description = "Medium-sized classroom with interactive smart board. Perfect for discussion-based classes.",
                    Capacity = 25,
                    ImageUrl = "/assets/imgs/classroom.jpg",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = null
                },
                new Classroom
                {
                    ClassroomName = "Lab B206",
                    Description = "Engineering laboratory with specialized equipment for practical experiments.",
                    Capacity = 20,
                    ImageUrl = "/assets/imgs/classroom.jpg",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = null
                },
                new Classroom
                {
                    ClassroomName = "Conference Room D401",
                    Description = "Large conference room with video conferencing facilities. Suitable for presentations and seminars.",
                    Capacity = 60,
                    ImageUrl = "/assets/imgs/classroom.jpg",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = null
                },
                new Classroom
                {
                    ClassroomName = "Classroom E201",
                    Description = "Small seminar room with round-table setup. Ideal for group discussions and workshops.",
                    Capacity = 15,
                    ImageUrl = "/assets/imgs/classroom.jpg",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = null
                },
                new Classroom
                {
                    ClassroomName = "Studio F101",
                    Description = "Multimedia studio with professional recording equipment. Used for video production and media classes.",
                    Capacity = 12,
                    ImageUrl = "/assets/imgs/classroom.jpg",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = null
                },
                new Classroom
                {
                    ClassroomName = "Classroom A201",
                    Description = "Standard classroom with modern teaching aids. Equipped with document camera and projector.",
                    Capacity = 35,
                    ImageUrl = "/assets/imgs/classroom.jpg",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = null
                },
                new Classroom
                {
                    ClassroomName = "Lab C402",
                    Description = "Chemistry laboratory with fume hoods and safety equipment. Designed for science experiments.",
                    Capacity = 24,
                    ImageUrl = "/assets/imgs/classroom.jpg",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = null
                }
            };

            await context.Classrooms.AddRangeAsync(classrooms);
            await context.SaveChangesAsync();
        }
    }
}

