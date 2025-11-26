using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace TTDVDTTNCXH.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _configuration;

        public TokenService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateToken(int userId, string email, string name)
        {
            var jwtSecret = _configuration["Jwt:Secret"] ?? "your-super-secret-key-min-32-characters-long-for-security-change-this-in-production";
            var jwtIssuer = _configuration["Jwt:Issuer"] ?? "TTDVDTTNCXH";
            var jwtAudience = _configuration["Jwt:Audience"] ?? "TTDVDTTNCXH";
            var expirationMinutes = int.Parse(_configuration["Jwt:ExpirationMinutes"] ?? "1440"); // 24 hours default

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim("email", email), // Custom claim để frontend có thể decode trực tiếp
                new Claim("name", name), // Custom claim để frontend có thể decode trực tiếp
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expirationMinutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}

