using System.ComponentModel.DataAnnotations.Schema;

namespace PeopleAnalytics.Api.Data.Entities;

[Table("Admin")]
public class Admin
{
    public Guid Id { get; set; }
    public Guid EmployeeId { get; set; }
    public string Role { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Employee Employee { get; set; } = null!;
}
