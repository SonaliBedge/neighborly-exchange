namespace NeighborlyExchange.Core.Entities;

public class SkillListing
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public AppUser? User { get; set; }

    public int SkillId { get; set; }
    public Skill? Skill { get; set; }

    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Availability { get; set; }
    public string? LookingFor { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}