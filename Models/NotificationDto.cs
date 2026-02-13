namespace PeopleAnalytics.Api.Models;

public class NotificationDto
{
    public Guid Id { get; set; }
    public Guid EmployeeId { get; set; }
    public string Channel { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public DateTime? SentAt { get; set; }
    public DateTime? ReadAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateNotificationDto
{
    public Guid EmployeeId { get; set; }
    public string Channel { get; set; } = "EMAIL";
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}

public class UpdateNotificationDto
{
    public string? Channel { get; set; }
    public string? Status { get; set; }
    public string? Title { get; set; }
    public string? Message { get; set; }
}
