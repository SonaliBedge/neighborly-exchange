using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NeighborlyExchange.Core.DTOs.Admin;
using NeighborlyExchange.Core.DTOs.Listings;
using NeighborlyExchange.Core.Entities;
using NeighborlyExchange.Infrastructure.Data;

namespace NeighborlyExchange.API.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly UserManager<AppUser> _userManager;

    public AdminController(AppDbContext context, UserManager<AppUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    // ── Platform Stats ─────────────────────────────────────
    [HttpGet("stats")]
    public async Task<ActionResult<PlatformStatsDto>> GetStats()
    {
        var oneWeekAgo = DateTime.UtcNow.AddDays(-7);

        var stats = new PlatformStatsDto
        {
            TotalUsers = await _context.Users.CountAsync(),
            TotalListings = await _context.SkillListings.CountAsync(),
            ActiveListings = await _context.SkillListings.CountAsync(l => l.IsActive),
            TotalRequests = 0, // Placeholder for future implementation
            CompletedExchanges = 0, // Placeholder for future implementation
            OpenRequests = 0, // Placeholder for future implementation
            // TotalRequests = await _context.HelpRequests.CountAsync(),
            // CompletedExchanges = await _context.HelpRequests
            //     .CountAsync(r => r.Status == "Completed"),
            // OpenRequests = await _context.HelpRequests
            //     .CountAsync(r => r.Status == "Open"),
            NewUsersThisWeek = await _context.Users
                .CountAsync(u => u.CreatedAt >= oneWeekAgo),
            NewListingsThisWeek = await _context.SkillListings
                .CountAsync(l => l.CreatedAt >= oneWeekAgo),
        };

        return Ok(stats);
    }
    // POST /api/admin/users/{id}/make-admin
    [HttpPost("users/{id}/make-admin")]
    public async Task<IActionResult> MakeAdmin(int id)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null) return NotFound();

        var alreadyAdmin = await _userManager.IsInRoleAsync(user, "Admin");
        if (alreadyAdmin)
            return BadRequest(new { message = "User is already an Admin." });

        await _userManager.AddToRoleAsync(user, "Admin");
        return Ok(new { message = $"{user.Email} is now an Admin." });
    }

    // ── Users ──────────────────────────────────────────────
    [HttpGet("users")]
    public async Task<ActionResult<List<AdminUserDto>>> GetUsers()
    {
        var users = await _context.Users
            .OrderByDescending(u => u.CreatedAt)
            .ToListAsync();

        var result = new List<AdminUserDto>();
        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            var lockout = await _userManager.IsLockedOutAsync(user);
            result.Add(new AdminUserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email ?? "",
                Neighborhood = user.Neighborhood,
                ReputationScore = user.ReputationScore,
                TotalExchanges = user.TotalExchanges,
                CreatedAt = user.CreatedAt,
                IsLocked = lockout,
                Roles = roles.ToList()
            });
        }

        return Ok(result);
    }

    // ── Lock / unlock a user ───────────────────────────────
    [HttpPatch("users/{id}/toggle-lock")]
    public async Task<IActionResult> ToggleLockUser(int id)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null) return NotFound();

        var isLocked = await _userManager.IsLockedOutAsync(user);
        if (isLocked)
            await _userManager.SetLockoutEndDateAsync(user, null);
        else
            await _userManager.SetLockoutEndDateAsync(user, DateTimeOffset.UtcNow.AddYears(100));

        return Ok(new { isLocked = !isLocked });
    }

    // ── All listings (including inactive) ─────────────────
    [HttpGet("listings")]
    public async Task<ActionResult<List<ListingResponseDto>>> GetAllListings()
    {
        var listings = await _context.SkillListings
            .Include(l => l.Skill)
            .Include(l => l.User)
            .OrderByDescending(l => l.CreatedAt)
            .Select(l => new ListingResponseDto
            {
                Id = l.Id,
                Title = l.Title,
                Description = l.Description,
                Availability = l.Availability,
                LookingFor = l.LookingFor,
                IsActive = l.IsActive,
                CreatedAt = l.CreatedAt,
                SkillName = l.Skill!.Name,
                SkillCategory = l.Skill!.Category,
                UserId = l.UserId,
                UserFirstName = l.User!.FirstName,
                UserLastName = l.User!.LastName,
                UserReputationScore = l.User!.ReputationScore
            })
            .ToListAsync();

        return Ok(listings);
    }

    // ── Remove a listing ───────────────────────────────────
    [HttpDelete("listings/{id}")]
    public async Task<IActionResult> RemoveListing(int id)
    {
        var listing = await _context.SkillListings.FindAsync(id);
        if (listing == null) return NotFound();

        _context.SkillListings.Remove(listing);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Listing removed." });
    }

    // ── Skill categories ───────────────────────────────────
    [HttpGet("skills")]
    public async Task<ActionResult<List<SkillDto>>> GetSkills()
    {
        var skills = await _context.Skills
            .Select(s => new SkillDto
            {
                Id = s.Id,
                Name = s.Name,
                Category = s.Category
            })
            .ToListAsync();
        return Ok(skills);
    }

    [HttpPost("skills")]
    public async Task<ActionResult<SkillDto>> AddSkill(SkillDto dto)
    {
        var skill = new Skill
        {
            Name = dto.Name,
            Category = dto.Category
        };
        _context.Skills.Add(skill);
        await _context.SaveChangesAsync();
        dto.Id = skill.Id;
        return Ok(dto);
    }

    [HttpDelete("skills/{id}")]
    public async Task<IActionResult> DeleteSkill(int id)
    {
        var skill = await _context.Skills.FindAsync(id);
        if (skill == null) return NotFound();

        var hasListings = await _context.SkillListings.AnyAsync(l => l.SkillId == id);
        if (hasListings)
            return BadRequest(new { message = "Cannot delete a skill that has active listings." });

        _context.Skills.Remove(skill);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Skill removed." });
    }
}