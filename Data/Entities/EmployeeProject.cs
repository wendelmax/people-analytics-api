using System.ComponentModel.DataAnnotations.Schema;

namespace PeopleAnalytics.Api.Data.Entities;

[Table("EmployeeProject")]
public class EmployeeProject
{
    public Guid Id { get; set; }
    public Guid EmployeeId { get; set; }
    public Guid ProjectId { get; set; }
    public string Role { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }

    public Employee Employee { get; set; } = null!;
    public Project Project { get; set; } = null!;
}
