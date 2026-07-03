namespace NeighborlyExchange.Core.DTOs.Listings;

public class ListingResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Availability { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }

    public string SkillName { get; set; } = string.Empty;
    public string SkillCategory { get; set; } = string.Empty;

    public int UserId { get; set; }
    public string UserFirstName { get; set; } = string.Empty;
    public string UserLastName { get; set; } = string.Empty;
    public string? LookingFor { get; set; }
    public decimal UserReputationScore { get; set; }
}