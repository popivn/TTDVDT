namespace TTDVDTTNCXH.Services
{
    public interface ITokenService
    {
        string GenerateToken(int userId, string email, string name);
    }
}

