using Microsoft.EntityFrameworkCore;
using TTDVDTTNCXH.Models;

namespace TTDVDTTNCXH.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; } // bảng Users
        public DbSet<Course> Courses { get; set; } // bảng Courses
        public DbSet<Event> Events { get; set; } // bảng Events
        public DbSet<Setting> Settings { get; set; } // bảng Settings
    }
}
