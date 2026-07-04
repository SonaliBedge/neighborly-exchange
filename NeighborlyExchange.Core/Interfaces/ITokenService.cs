using NeighborlyExchange.Core.Entities;

namespace NeighborlyExchange.Core.Interfaces;

public interface ITokenService
{
    Task<(string token, DateTime expiresAt)> GenerateTokenAsync(AppUser user);
}