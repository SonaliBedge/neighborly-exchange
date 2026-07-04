using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NeighborlyExchange.Core.DTOs.Listings;
using NeighborlyExchange.Core.Entities;
using NeighborlyExchange.Infrastructure.Data;
using System.Security.Claims;

namespace NeighborlyExchange.API.Controllers;

[ApiController]
[Route("api/listings")]
public class SkillListingsController : ControllerBase
{
    private readonly AppDbContext _context;

    public SkillListingsController(AppDbContext context)
    {
        _context = context;
    }

    // GET /api/listings — browse all active listings (public, no auth required)
    [HttpGet]
    public async Task<ActionResult<List<ListingResponseDto>>> GetListings()
    {
        var listings = await _context.SkillListings
            .Where(l => l.IsActive)
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

    // GET /api/listings/my — get current user's own listings
    [HttpGet("my")]
    [Authorize]
    public async Task<ActionResult<List<ListingResponseDto>>> GetMyListings()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var listings = await _context.SkillListings
            .Where(l => l.UserId == userId)
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
    // PUT /api/listings/{id} — update own listing
    [HttpPut("{id}")]
    [Authorize]
    public async Task<ActionResult<ListingResponseDto>> UpdateListing(int id, CreateListingDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var listing = await _context.SkillListings
            .Include(l => l.Skill)
            .Include(l => l.User)
            .FirstOrDefaultAsync(l => l.Id == id);

        if (listing == null) return NotFound();
        if (listing.UserId != userId) return Forbid();

        var skillExists = await _context.Skills.AnyAsync(s => s.Id == dto.SkillId);
        if (!skillExists) return BadRequest(new { message = "Selected skill does not exist." });

        listing.SkillId = dto.SkillId;
        listing.Title = dto.Title;
        listing.Description = dto.Description;
        listing.Availability = dto.Availability;
        listing.LookingFor = dto.LookingFor;

        await _context.SaveChangesAsync();

        var skill = await _context.Skills.FindAsync(dto.SkillId);

        return Ok(new ListingResponseDto
        {
            Id = listing.Id,
            Title = listing.Title,
            Description = listing.Description,
            Availability = listing.Availability,
            LookingFor = listing.LookingFor,
            IsActive = listing.IsActive,
            CreatedAt = listing.CreatedAt,
            SkillName = skill!.Name,
            SkillCategory = skill.Category,
            UserId = userId,
            UserFirstName = listing.User!.FirstName,
            UserLastName = listing.User!.LastName,
            UserReputationScore = listing.User!.ReputationScore
        });
    }

    // PATCH /api/listings/{id}/toggle — activate or deactivate
    [HttpPatch("{id}/toggle")]
    [Authorize]
    public async Task<IActionResult> ToggleListing(int id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var listing = await _context.SkillListings.FindAsync(id);
        if (listing == null) return NotFound();
        if (listing.UserId != userId) return Forbid();

        listing.IsActive = !listing.IsActive;
        await _context.SaveChangesAsync();

        return Ok(new { isActive = listing.IsActive });
    }

    // POST /api/listings — create a new listing (requires auth)
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<ListingResponseDto>> CreateListing(CreateListingDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var skillExists = await _context.Skills.AnyAsync(s => s.Id == dto.SkillId);
        if (!skillExists)
            return BadRequest(new { message = "Selected skill does not exist." });

        var listing = new SkillListing
        {
            UserId = userId,
            SkillId = dto.SkillId,
            Title = dto.Title,
            Description = dto.Description,
            Availability = dto.Availability,
            LookingFor = dto.LookingFor,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.SkillListings.Add(listing);
        await _context.SaveChangesAsync();

        // Reload with related data to return a full response
        var skill = await _context.Skills.FindAsync(dto.SkillId);
        var user = await _context.Users.FindAsync(userId);

        return Ok(new ListingResponseDto
        {
            Id = listing.Id,
            Title = listing.Title,
            Description = listing.Description,
            Availability = listing.Availability,
            IsActive = listing.IsActive,
            CreatedAt = listing.CreatedAt,
            SkillName = skill!.Name,
            SkillCategory = skill.Category,
            UserId = userId,
            UserFirstName = user!.FirstName,
            UserLastName = user.LastName,
            UserReputationScore = user.ReputationScore,
            LookingFor = listing.LookingFor
        });
    }
}