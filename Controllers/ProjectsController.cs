using Microsoft.AspNetCore.Mvc;
using PeopleAnalytics.Api.Models;
using PeopleAnalytics.Api.Services;

namespace PeopleAnalytics.Api.Controllers;

[ApiController]
[Route("api/projects")]
public class ProjectsController : ControllerBase
{
    private readonly ProjectService _service;

    public ProjectsController(ProjectService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<List<ProjectDto>>> GetAll() =>
        Ok(await _service.GetAllAsync());

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ProjectDto>> GetById(Guid id)
    {
        var p = await _service.GetByIdAsync(id);
        if (p == null) return NotFound();
        return Ok(p);
    }

    [HttpPost]
    public async Task<ActionResult<ProjectDto>> Create([FromBody] CreateProjectDto dto)
    {
        var p = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = p.Id }, p);
    }

    [HttpPatch("{id:guid}")]
    public async Task<ActionResult<ProjectDto>> Update(Guid id, [FromBody] UpdateProjectDto dto)
    {
        var p = await _service.UpdateAsync(id, dto);
        if (p == null) return NotFound();
        return Ok(p);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        if (!await _service.DeleteAsync(id)) return NotFound();
        return NoContent();
    }
}
