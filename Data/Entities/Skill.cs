using System.ComponentModel.DataAnnotations.Schema;

namespace PeopleAnalytics.Api.Data.Entities;

[Table("Skill")]
public class Skill
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string DefaultLevel { get; set; } = "BEGINNER";
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public ICollection<ProjectSkill> ProjectLinks { get; set; } = new List<ProjectSkill>();
}
