namespace PeopleAnalytics.Api.Models;

public class ProjectDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public double? Budget { get; set; }
    public Guid? OwnerId { get; set; }
    public List<Guid> SkillIds { get; set; } = new();
    public List<ProjectTeamMemberDto> TeamMembers { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class ProjectTeamMemberDto
{
    public Guid Id { get; set; }
    public Guid EmployeeId { get; set; }
    public string? Role { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}

public class CreateProjectDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public double? Budget { get; set; }
    public Guid? OwnerId { get; set; }
    public List<Guid>? SkillIds { get; set; }
    public List<ProjectTeamMemberInputDto>? Team { get; set; }
}

public class ProjectTeamMemberInputDto
{
    public Guid EmployeeId { get; set; }
    public string? Role { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}

public class UpdateProjectDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? Status { get; set; }
    public double? Budget { get; set; }
    public Guid? OwnerId { get; set; }
    public List<Guid>? SkillIds { get; set; }
    public List<ProjectTeamMemberInputDto>? Team { get; set; }
}
