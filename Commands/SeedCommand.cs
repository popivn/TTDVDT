using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TTDVDTTNCXH.Data;

namespace TTDVDTTNCXH.Commands
{
    public class SeedCommand
    {
        public static async Task<int> InvokeAsync(string[] args)
        {
            string? seederPath = null;

            // Parse arguments
            for (int i = 0; i < args.Length; i++)
            {
                if (args[i] == "--path" || args[i] == "-p")
                {
                    if (i + 1 < args.Length)
                    {
                        seederPath = args[i + 1];
                        i++; // Skip next argument
                    }
                }
                else if (args[i].StartsWith("--path="))
                {
                    seederPath = args[i].Substring("--path=".Length);
                }
            }

            await ExecuteSeed(seederPath);
            return Environment.ExitCode;
        }

        private static async Task ExecuteSeed(string? seederPath)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(seederPath))
                {
                    Console.WriteLine("Error: --path option is required");
                    Console.WriteLine("Usage: dotnet run -- seed --path=Data\\ClassroomSeeder.cs");
                    Console.WriteLine("\nAvailable seeders:");
                    Console.WriteLine("  - Data\\ClassroomSeeder.cs");
                    Environment.ExitCode = 1;
                    return;
                }

                Console.WriteLine($"Starting seed operation for: {seederPath}");

                // Build configuration
                var configuration = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                    .AddJsonFile("appsettings.Development.json", optional: true, reloadOnChange: true)
                    .AddEnvironmentVariables()
                    .Build();

                // Setup DbContext
                var services = new ServiceCollection();
                services.AddDbContext<AppDbContext>(options =>
                    options.UseMySql(
                        configuration.GetConnectionString("DefaultConnection"),
                        new MySqlServerVersion(new Version(8, 0, 33))
                    )
                );

                var serviceProvider = services.BuildServiceProvider();
                
                using (var scope = serviceProvider.CreateScope())
                {
                    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                    // Execute seeder based on path
                    var seederName = seederPath.Replace("\\", ".").Replace("/", ".").Replace(".cs", "").ToLower();
                    
                    if (seederName.Contains("classroomseeder") || seederName.EndsWith("classroomseeder"))
                    {
                        Console.WriteLine("Seeding Classrooms...");
                        await ClassroomSeeder.SeedAsync(context);
                        Console.WriteLine("Classrooms seeded successfully!");
                    }
                    else
                    {
                        Console.WriteLine($"Unknown seeder: {seederPath}");
                        Console.WriteLine("Available seeders:");
                        Console.WriteLine("  - Data\\ClassroomSeeder.cs");
                        Environment.ExitCode = 1;
                        return;
                    }
                }

                Console.WriteLine("Seed operation completed successfully!");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error during seed operation: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
                Environment.ExitCode = 1;
            }
        }
    }
}

