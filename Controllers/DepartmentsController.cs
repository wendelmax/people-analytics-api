using Microsoft.AspNetCore.Mvc;
using PeopleAnalytics.Api.Models;
using PeopleAnalytics.Api.Services;

namespace PeopleAnalytics.Api.Controllers;

[ApiController]
[Route("api/departments")]
public class DepartmentsController : ControllerBase
{
    private readonly DepartmentService _service;

    public DepartmentsController(DepartmentService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<List<DepartmentDto>>> GetAll() =>
        Ok(await _service.GetAllAsync());

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<DepartmentDto>> GetById(Guid id)
    {
        var d = await _service.GetByIdAsync(id);
        if (d == null) return NotFound();
        return Ok(d);
    }

    [HttpPost]
    public async Task<ActionResult<DepartmentDto>> Create([FromBody] CreateDepartmentDto dto)
    {
        var d = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = d.Id }, d);
    }

    [HttpPatch("{id:guid}")]
    public async Task<ActionResult<DepartmentDto>> Update(Guid id, [FromBody] UpdateDepartmentDto dto)
    {
        var d = await _service.UpdateAsync(id, dto);
        if (d == null) return NotFound();
        return Ok(d);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        if (!await _service.DeleteAsync(id)) return NotFound();
        return NoContent();
    }
}
