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
        public DbSet<Faculty> Faculties { get; set; } // bảng Faculties
        public DbSet<Classroom> Classrooms { get; set; } // bảng Classrooms

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Cấu hình relationship giữa Course và Classroom
            modelBuilder.Entity<Course>()
                .HasOne(c => c.Classroom)
                .WithMany()
                .HasForeignKey(c => c.ClassId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
