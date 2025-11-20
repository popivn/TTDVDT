using Microsoft.EntityFrameworkCore;
using TTDVDTTNCXH.Data;
using TTDVDTTNCXH.Models;
using TTDVDTTNCXH.Repositories;
using TTDVDTTNCXH.Services;
using Microsoft.Extensions.FileProviders;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

// Thêm dịch vụ cho controllers
builder.Services.AddControllers();

// Cấu hình CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:4200", "http://localhost:5217", "https://ttdvdt.onrender.com")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Đăng ký DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 0, 33))
    )
);

// Đăng ký Repository
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ISettingRepository, SettingRepository>();

// Đăng ký Service
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ISettingService, SettingService>();

var app = builder.Build();

// Quan trọng: CORS phải được gọi TRƯỚC UseHttpsRedirection và UseStaticFiles
app.UseCors();

// HTTPS redirection
app.UseHttpsRedirection();

// Phục vụ static files Angular từ wwwroot/browser
var browserPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "browser");
if (Directory.Exists(browserPath))
{
    app.UseDefaultFiles(new DefaultFilesOptions
    {
        FileProvider = new PhysicalFileProvider(browserPath),
        RequestPath = ""
    });
    
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(browserPath),
        RequestPath = ""
    });
}
else
{
    // Fallback: serve từ wwwroot root nếu không có browser subfolder
    app.UseDefaultFiles();
    app.UseStaticFiles();
}

// Map controllers
app.MapControllers();

// Minimal API hiện tại (WeatherForecast)
var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

// Fallback SPA routing
var indexPath = Path.Combine("wwwroot", "browser", "index.html");
if (File.Exists(indexPath))
{
    app.MapFallbackToFile("index.html", new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "browser")),
        RequestPath = ""
    });
}
else
{
    // Fallback for development
    var devPath = Path.Combine("ClientApp", "dist", "TTDVDTTNCXHClient", "browser", "index.html");
    if (File.Exists(devPath))
    {
        app.MapFallbackToFile(devPath);
    }
}

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}