using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NeighborlyExchange.Core.DTOs.Listings;
using NeighborlyExchange.Infrastructure.Data;

namespace NeighborlyExchange.API.Controllers;

[ApiController]
[Route("api/skills")]
public class SkillsController : ControllerBase
{
    private readonly AppDbContext _context;

    public SkillsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<SkillDto>>> GetSkills()
    {
        var skills = await _context.Skills
            .Select(s => new SkillDto { Id = s.Id, Name = s.Name, Category = s.Category })
            .ToListAsync();

        return Ok(skills);
    }
}