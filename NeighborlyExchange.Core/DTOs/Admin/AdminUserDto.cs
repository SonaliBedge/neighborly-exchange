namespace NeighborlyExchange.Core.DTOs.Admin;

public class AdminUserDto
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Neighborhood { get; set; }
    public decimal ReputationScore { get; set; }
    public int TotalExchanges { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsLocked { get; set; }
    public List<string> Roles { get; set; } = new();
}