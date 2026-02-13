using Microsoft.EntityFrameworkCore;
using PeopleAnalytics.Api.Data.Entities;

namespace PeopleAnalytics.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Department> Departments { get; set; }
    public DbSet<Position> Positions { get; set; }
    public DbSet<Employee> Employees { get; set; }
    public DbSet<Admin> Admins { get; set; }
    public DbSet<Project> Projects { get; set; }
    public DbSet<EmployeeProject> EmployeeProjects { get; set; }
    public DbSet<ProjectSkill> ProjectSkills { get; set; }
    public DbSet<Skill> Skills { get; set; }
    public DbSet<Notification> Notifications { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        foreach (var entity in modelBuilder.Model.GetEntityTypes())
        {
            foreach (var property in entity.GetProperties())
            {
                var name = property.Name;
                if (name.Length > 0)
                    property.SetColumnName(char.ToLowerInvariant(name[0]) + name[1..]);
            }
        }

        modelBuilder.Entity<Department>().ToTable("Department");
        modelBuilder.Entity<Position>().ToTable("Position");
        modelBuilder.Entity<Employee>().ToTable("Employee");
        modelBuilder.Entity<Admin>().ToTable("Admin");
        modelBuilder.Entity<Project>().ToTable("Project");
        modelBuilder.Entity<EmployeeProject>().ToTable("EmployeeProject");
        modelBuilder.Entity<Skill>().ToTable("Skill");
        modelBuilder.Entity<Notification>().ToTable("Notification");

        modelBuilder.Entity<ProjectSkill>().ToTable("ProjectSkill")
            .HasKey(ps => new { ps.ProjectId, ps.SkillId });

        modelBuilder.Entity<Employee>().HasOne(e => e.Manager)
            .WithMany(e => e.Reports)
            .HasForeignKey(e => e.ManagerId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Employee>().HasOne(e => e.AdminProfile)
            .WithOne(a => a.Employee)
            .HasForeignKey<Admin>(a => a.EmployeeId);
    }
}
