namespace PeopleAnalytics.Api.Models;

public class EmployeeDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public DateTime HireDate { get; set; }
    public Guid DepartmentId { get; set; }
    public Guid PositionId { get; set; }
    public Guid? ManagerId { get; set; }
    public string? Status { get; set; }
    public string? DepartmentName { get; set; }
    public string? PositionTitle { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateEmployeeDto
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public DateTime HireDate { get; set; }
    public Guid DepartmentId { get; set; }
    public Guid PositionId { get; set; }
    public Guid? ManagerId { get; set; }
    public List<Guid>? SkillIds { get; set; }
}

public class UpdateEmployeeDto
{
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public DateTime? HireDate { get; set; }
    public Guid? DepartmentId { get; set; }
    public Guid? PositionId { get; set; }
    public Guid? ManagerId { get; set; }
    public string? Status { get; set; }
}
