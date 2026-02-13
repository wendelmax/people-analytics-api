using System.ComponentModel.DataAnnotations.Schema;

namespace PeopleAnalytics.Api.Data.Entities;

[Table("Employee")]
public class Employee
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
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Department Department { get; set; } = null!;
    public Position Position { get; set; } = null!;
    public Employee? Manager { get; set; }
    public ICollection<Employee> Reports { get; set; } = new List<Employee>();
    public Admin? AdminProfile { get; set; }
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    public ICollection<EmployeeProject> EmployeeProjects { get; set; } = new List<EmployeeProject>();
    public ICollection<Project> OwnedProjects { get; set; } = new List<Project>();
}
