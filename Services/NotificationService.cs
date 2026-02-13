using Microsoft.EntityFrameworkCore;
using PeopleAnalytics.Api.Data;
using PeopleAnalytics.Api.Data.Entities;
using PeopleAnalytics.Api.Models;

namespace PeopleAnalytics.Api.Services;

public class NotificationService
{
    private readonly AppDbContext _db;

    public NotificationService(AppDbContext db) => _db = db;

    public async Task<List<NotificationDto>> GetAllAsync()
    {
        var list = await _db.Notifications.OrderByDescending(n => n.CreatedAt).ToListAsync();
        return list.Select(Map).ToList();
    }

    public async Task<NotificationDto?> GetByIdAsync(Guid id)
    {
        var n = await _db.Notifications.FindAsync(id);
        return n == null ? null : Map(n);
    }

    public async Task<List<NotificationDto>> GetUnreadByUserAsync(Guid userId)
    {
        var list = await _db.Notifications
            .Where(n => n.EmployeeId == userId && n.ReadAt == null)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();
        return list.Select(Map).ToList();
    }

    public async Task<NotificationDto> CreateAsync(CreateNotificationDto dto)
    {
        var n = new Notification
        {
            Id = Guid.NewGuid(),
            EmployeeId = dto.EmployeeId,
            Channel = dto.Channel,
            Status = "PENDING",
            Title = dto.Title,
            Message = dto.Message,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Notifications.Add(n);
        await _db.SaveChangesAsync();
        return Map(n);
    }

    public async Task<NotificationDto?> UpdateAsync(Guid id, UpdateNotificationDto dto)
    {
        var n = await _db.Notifications.FindAsync(id);
        if (n == null) return null;
        if (dto.Channel != null) n.Channel = dto.Channel;
        if (dto.Status != null) n.Status = dto.Status;
        if (dto.Title != null) n.Title = dto.Title;
        if (dto.Message != null) n.Message = dto.Message;
        n.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return Map(n);
    }

    public async Task<NotificationDto?> MarkAsReadAsync(Guid id)
    {
        var n = await _db.Notifications.FindAsync(id);
        if (n == null) return null;
        n.Status = "READ";
        n.ReadAt = DateTime.UtcNow;
        n.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return Map(n);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var n = await _db.Notifications.FindAsync(id);
        if (n == null) return false;
        _db.Notifications.Remove(n);
        await _db.SaveChangesAsync();
        return true;
    }

    private static NotificationDto Map(Notification n) => new()
    {
        Id = n.Id,
        EmployeeId = n.EmployeeId,
        Channel = n.Channel,
        Status = n.Status,
        Title = n.Title,
        Message = n.Message,
        SentAt = n.SentAt,
        ReadAt = n.ReadAt,
        CreatedAt = n.CreatedAt,
        UpdatedAt = n.UpdatedAt
    };
}
