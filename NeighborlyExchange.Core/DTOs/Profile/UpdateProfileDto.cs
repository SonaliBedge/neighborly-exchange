namespace NeighborlyExchange.Core.DTOs.Profile;

public class UpdateProfileDto
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public string? Neighborhood { get; set; }
}