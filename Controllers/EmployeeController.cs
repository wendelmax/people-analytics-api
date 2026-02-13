using Microsoft.AspNetCore.Mvc;
using PeopleAnalytics.Api.Models;
using PeopleAnalytics.Api.Services;

namespace PeopleAnalytics.Api.Controllers;

[ApiController]
[Route("api/employee")]
public class EmployeeController : ControllerBase
{
    private readonly EmployeeService _service;

    public EmployeeController(EmployeeService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<List<EmployeeDto>>> GetAll() =>
        Ok(await _service.GetAllAsync());

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<EmployeeDto>> GetById(Guid id)
    {
        var e = await _service.GetByIdAsync(id);
        if (e == null) return NotFound();
        return Ok(e);
    }

    [HttpPost]
    public async Task<ActionResult<EmployeeDto>> Create([FromBody] CreateEmployeeDto dto)
    {
        var e = await _service.CreateAsync(dto);
        if (e == null) return BadRequest();
        return CreatedAtAction(nameof(GetById), new { id = e.Id }, e);
    }

    [HttpPatch("{id:guid}")]
    public async Task<ActionResult<EmployeeDto>> Update(Guid id, [FromBody] UpdateEmployeeDto dto)
    {
        var e = await _service.UpdateAsync(id, dto);
        if (e == null) return NotFound();
        return Ok(e);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        if (!await _service.DeleteAsync(id)) return NotFound();
        return NoContent();
    }
}
