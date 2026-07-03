namespace NeighborlyExchange.Core.DTOs.Listings;

public class CreateListingDto
{
    public int SkillId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Availability { get; set; }
    public string? LookingFor { get; set; }
}