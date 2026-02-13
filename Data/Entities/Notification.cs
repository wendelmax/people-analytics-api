using System.ComponentModel.DataAnnotations.Schema;

namespace PeopleAnalytics.Api.Data.Entities;

[Table("Notification")]
public class Notification
{
    public Guid Id { get; set; }
    public Guid EmployeeId { get; set; }
    public string Channel { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string? Metadata { get; set; }
    public DateTime? SentAt { get; set; }
    public DateTime? ReadAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Employee Employee { get; set; } = null!;
}
