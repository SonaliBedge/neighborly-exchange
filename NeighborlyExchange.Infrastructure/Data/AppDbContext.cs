using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using NeighborlyExchange.Core.Entities;

namespace NeighborlyExchange.Infrastructure.Data;

public class AppDbContext : IdentityDbContext<AppUser, AppRole, int>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        // We'll add HelpRequests, Reviews, Messages, etc. here
        // as we build out each feature in later weeks.
        builder.Entity<AppUser>(entity =>
        {
            entity.Property(u => u.ReputationScore)
                .HasPrecision(3, 2);
        });
    }
}