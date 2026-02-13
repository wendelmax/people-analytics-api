using Microsoft.AspNetCore.Mvc;
using PeopleAnalytics.Api.Models;
using PeopleAnalytics.Api.Services;

namespace PeopleAnalytics.Api.Controllers;

[ApiController]
[Route("api/notifications")]
public class NotificationsController : ControllerBase
{
    private readonly NotificationService _service;

    public NotificationsController(NotificationService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<List<NotificationDto>>> GetAll() =>
        Ok(await _service.GetAllAsync());

    [HttpGet("user/{userId:guid}/unread")]
    public async Task<ActionResult<List<NotificationDto>>> GetUnread(Guid userId) =>
        Ok(await _service.GetUnreadByUserAsync(userId));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<NotificationDto>> GetById(Guid id)
    {
        var n = await _service.GetByIdAsync(id);
        if (n == null) return NotFound();
        return Ok(n);
    }

    [HttpPost]
    public async Task<ActionResult<NotificationDto>> Create([FromBody] CreateNotificationDto dto)
    {
        var n = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = n.Id }, n);
    }

    [HttpPatch("{id:guid}")]
    public async Task<ActionResult<NotificationDto>> Update(Guid id, [FromBody] UpdateNotificationDto dto)
    {
        var n = await _service.UpdateAsync(id, dto);
        if (n == null) return NotFound();
        return Ok(n);
    }

    [HttpPatch("{id:guid}/read")]
    public async Task<ActionResult<NotificationDto>> MarkAsRead(Guid id)
    {
        var n = await _service.MarkAsReadAsync(id);
        if (n == null) return NotFound();
        return Ok(n);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        if (!await _service.DeleteAsync(id)) return NotFound();
        return NoContent();
    }
}
