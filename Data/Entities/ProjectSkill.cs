using System.ComponentModel.DataAnnotations.Schema;

namespace PeopleAnalytics.Api.Data.Entities;

[Table("ProjectSkill")]
public class ProjectSkill
{
    public Guid ProjectId { get; set; }
    public Guid SkillId { get; set; }

    public Project Project { get; set; } = null!;
    public Skill Skill { get; set; } = null!;
}
