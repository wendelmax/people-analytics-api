using System.ComponentModel.DataAnnotations.Schema;

namespace PeopleAnalytics.Api.Data.Entities;

[Table("Project")]
public class Project
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public double? Budget { get; set; }
    public Guid? OwnerId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Employee? Owner { get; set; }
    public ICollection<EmployeeProject> Team { get; set; } = new List<EmployeeProject>();
    public ICollection<ProjectSkill> RequiredSkills { get; set; } = new List<ProjectSkill>();
}
