using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NeighborlyExchange.Core.DTOs.Profile;
using NeighborlyExchange.Core.Entities;
using NeighborlyExchange.Infrastructure.Data;
using System.Security.Claims;

namespace NeighborlyExchange.API.Controllers;

[ApiController]
[Route("api/profile")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly UserManager<AppUser> _userManager;

    public ProfileController(AppDbContext context, UserManager<AppUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    // GET /api/profile/me — get own profile
    [HttpGet("me")]
    public async Task<ActionResult<UserProfileDto>> GetMyProfile()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null) return NotFound();

        var skills = await _context.SkillListings
            .Where(l => l.UserId == userId && l.IsActive)
            .Include(l => l.Skill)
            .Select(l => l.Skill!.Name)
            .ToListAsync();

        return Ok(MapToDto(user, skills));
    }

    // GET /api/profile/{id} — get any user's public profile
    [HttpGet("{id}")]
    public async Task<ActionResult<UserProfileDto>> GetProfile(int id)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null) return NotFound();

        var skills = await _context.SkillListings
            .Where(l => l.UserId == id && l.IsActive)
            .Include(l => l.Skill)
            .Select(l => l.Skill!.Name)
            .ToListAsync();

        return Ok(MapToDto(user, skills));
    }

    // PUT /api/profile/me — update own profile
    [HttpPut("me")]
    public async Task<ActionResult<UserProfileDto>> UpdateProfile(UpdateProfileDto dto)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null) return NotFound();

        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;
        user.Bio = dto.Bio;
        user.Neighborhood = dto.Neighborhood;

        await _context.SaveChangesAsync();

        var skills = await _context.SkillListings
            .Where(l => l.UserId == userId && l.IsActive)
            .Include(l => l.Skill)
            .Select(l => l.Skill!.Name)
            .ToListAsync();

        return Ok(MapToDto(user, skills));
    }

    private int? GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(claim, out var id) ? id : null;
    }

    private static UserProfileDto MapToDto(AppUser user, List<string> skills) => new()
    {
        Id = user.Id,
        FirstName = user.FirstName,
        LastName = user.LastName,
        Email = user.Email ?? "",
        Bio = user.Bio,
        Neighborhood = user.Neighborhood,
        ProfileImageUrl = user.ProfileImageUrl,
        ReputationScore = user.ReputationScore,
        TotalExchanges = user.TotalExchanges,
        CreatedAt = user.CreatedAt,
        SkillsOffered = skills,
    };
}