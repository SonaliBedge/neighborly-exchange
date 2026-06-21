using NeighborlyExchange.Core.Entities;

namespace NeighborlyExchange.Core.Interfaces;

public interface ITokenService
{
    (string token, DateTime expiresAt) GenerateToken(AppUser user);
}