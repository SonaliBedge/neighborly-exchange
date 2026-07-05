namespace NeighborlyExchange.Core.DTOs.Profile;

public class UserProfileDto
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public string? Neighborhood { get; set; }
    public string? ProfileImageUrl { get; set; }
    public decimal ReputationScore { get; set; }
    public int TotalExchanges { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<string> SkillsOffered { get; set; } = new();
}