using Microsoft.AspNetCore.Identity;

namespace NeighborlyExchange.Core.Entities;

public class AppUser : IdentityUser<int>
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName  { get; set; } = string.Empty;
    public string? Bio      { get; set; }
    public string? Neighborhood { get; set; }
    public string? ProfileImageUrl { get; set; }
    public decimal ReputationScore { get; set; } = 0;
    public int TotalExchanges      { get; set; } = 0;
    public DateTime CreatedAt      { get; set; } = DateTime.UtcNow;
}

public class AppRole : IdentityRole<int> { }