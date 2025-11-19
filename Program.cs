using Microsoft.EntityFrameworkCore;
using TTDVDTTNCXH.Data;
using TTDVDTTNCXH.Models;
using TTDVDTTNCXH.Repositories;
using TTDVDTTNCXH.Services;

var builder = WebApplication.CreateBuilder(args);

// Thêm dịch vụ cho controllers
builder.Services.AddControllers();
builder.Services.AddCors(); // cho dev server Angular gọi API

// Đăng ký DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 0, 33)) // MySQL version
    )
);

// Đăng ký Repository
builder.Services.AddScoped<IUserRepository, UserRepository>();

// Đăng ký Service
builder.Services.AddScoped<IUserService, UserService>();

var app = builder.Build();

// Enable CORS nếu Angular dev server chạy port khác
app.UseCors(policy => policy
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());

// HTTPS redirection
app.UseHttpsRedirection();

// Phục vụ static files Angular
app.UseDefaultFiles(); // index.html
app.UseStaticFiles();  // css, js, assets

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
var indexPath = Path.Combine("wwwroot", "index.html");
if (File.Exists(indexPath))
{
    app.MapFallbackToFile("index.html");
}
else
{
    // Fallback for development
    app.MapFallbackToFile(Path.Combine("ClientApp", "TTDVDTTNCXHClient", "dist", "TTDVDTTNCXHClient", "index.html"));
}

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
