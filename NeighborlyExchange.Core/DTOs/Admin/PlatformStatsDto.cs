namespace NeighborlyExchange.Core.DTOs.Admin;

public class PlatformStatsDto
{
    public int TotalUsers { get; set; }
    public int TotalListings { get; set; }
    public int ActiveListings { get; set; }
    public int TotalRequests { get; set; }
    public int CompletedExchanges { get; set; }
    public int OpenRequests { get; set; }
    public int NewUsersThisWeek { get; set; }
    public int NewListingsThisWeek { get; set; }
}