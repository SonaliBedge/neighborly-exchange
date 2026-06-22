using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using NeighborlyExchange.Core.Entities;

namespace NeighborlyExchange.Infrastructure.Data;

public class AppDbContext : IdentityDbContext<AppUser, AppRole, int>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Skill> Skills => Set<Skill>();
    public DbSet<SkillListing> SkillListings => Set<SkillListing>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<AppUser>(entity =>
        {
            entity.Property(u => u.ReputationScore).HasPrecision(3, 2);
        });

        builder.Entity<SkillListing>(entity =>
        {
            entity.HasOne(l => l.User)
                  .WithMany()
                  .HasForeignKey(l => l.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(l => l.Skill)
                  .WithMany()
                  .HasForeignKey(l => l.SkillId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Seed initial skill categories
        builder.Entity<Skill>().HasData(
            new Skill { Id = 1, Name = "Tutoring", Category = "Education" },
            new Skill { Id = 2, Name = "Gardening", Category = "Home & Garden" },
            new Skill { Id = 3, Name = "Babysitting", Category = "Childcare" },
            new Skill { Id = 4, Name = "Tech Support", Category = "Tech" },
            new Skill { Id = 5, Name = "Cooking Lessons", Category = "Food" },
            new Skill { Id = 6, Name = "Home Repairs", Category = "Home & Garden" },
            new Skill { Id = 7, Name = "Transportation", Category = "Transport" }
        );
    }
}