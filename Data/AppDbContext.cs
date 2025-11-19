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
    }
}
