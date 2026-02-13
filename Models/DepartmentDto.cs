namespace PeopleAnalytics.Api.Models;

public class DepartmentDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public List<Guid> PositionIds { get; set; } = new();
    public List<Guid> EmployeeIds { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateDepartmentDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}

public class UpdateDepartmentDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
}
