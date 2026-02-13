using Microsoft.EntityFrameworkCore;
using PeopleAnalytics.Api.Data;
using PeopleAnalytics.Api.Data.Entities;
using PeopleAnalytics.Api.Models;

namespace PeopleAnalytics.Api.Services;

public class ProjectService
{
    private readonly AppDbContext _db;

    public ProjectService(AppDbContext db) => _db = db;

    public async Task<List<ProjectDto>> GetAllAsync()
    {
        var list = await _db.Projects
            .Include(p => p.Owner)
            .Include(p => p.Team)
            .Include(p => p.RequiredSkills)
            .OrderByDescending(p => p.StartDate)
            .ToListAsync();
        return list.Select(Map).ToList();
    }

    public async Task<ProjectDto?> GetByIdAsync(Guid id)
    {
        var p = await _db.Projects
            .Include(x => x.Owner)
            .Include(x => x.Team)
            .Include(x => x.RequiredSkills)
            .FirstOrDefaultAsync(x => x.Id == id);
        return p == null ? null : Map(p);
    }

    public async Task<ProjectDto> CreateAsync(CreateProjectDto dto)
    {
        var p = new Project
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Description = dto.Description,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            Status = dto.Status,
            Budget = dto.Budget,
            OwnerId = dto.OwnerId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Projects.Add(p);
        if (dto.SkillIds?.Count > 0)
            foreach (var skillId in dto.SkillIds)
                p.RequiredSkills.Add(new ProjectSkill { ProjectId = p.Id, SkillId = skillId });
        if (dto.Team?.Count > 0)
            foreach (var m in dto.Team)
                p.Team.Add(new EmployeeProject
                {
                    Id = Guid.NewGuid(),
                    EmployeeId = m.EmployeeId,
                    ProjectId = p.Id,
                    Role = m.Role ?? "",
                    StartDate = m.StartDate,
                    EndDate = m.EndDate
                });
        await _db.SaveChangesAsync();
        return (await GetByIdAsync(p.Id))!;
    }

    public async Task<ProjectDto?> UpdateAsync(Guid id, UpdateProjectDto dto)
    {
        var p = await _db.Projects.Include(x => x.Team).Include(x => x.RequiredSkills).FirstOrDefaultAsync(x => x.Id == id);
        if (p == null) return null;
        if (dto.Name != null) p.Name = dto.Name;
        if (dto.Description != null) p.Description = dto.Description;
        if (dto.StartDate.HasValue) p.StartDate = dto.StartDate.Value;
        if (dto.EndDate.HasValue) p.EndDate = dto.EndDate;
        if (dto.Status != null) p.Status = dto.Status;
        if (dto.Budget.HasValue) p.Budget = dto.Budget;
        if (dto.OwnerId.HasValue) p.OwnerId = dto.OwnerId;
        if (dto.SkillIds != null)
        {
            _db.ProjectSkills.RemoveRange(p.RequiredSkills);
            foreach (var skillId in dto.SkillIds)
                p.RequiredSkills.Add(new ProjectSkill { ProjectId = id, SkillId = skillId });
        }
        if (dto.Team != null)
        {
            _db.EmployeeProjects.RemoveRange(p.Team);
            foreach (var m in dto.Team)
                p.Team.Add(new EmployeeProject
                {
                    Id = Guid.NewGuid(),
                    EmployeeId = m.EmployeeId,
                    ProjectId = id,
                    Role = m.Role ?? "",
                    StartDate = m.StartDate,
                    EndDate = m.EndDate
                });
        }
        p.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return await GetByIdAsync(id);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var p = await _db.Projects.FindAsync(id);
        if (p == null) return false;
        _db.Projects.Remove(p);
        await _db.SaveChangesAsync();
        return true;
    }

    private static ProjectDto Map(Project p) => new()
    {
        Id = p.Id,
        Name = p.Name,
        Description = p.Description,
        StartDate = p.StartDate,
        EndDate = p.EndDate,
        Status = p.Status,
        Budget = p.Budget,
        OwnerId = p.OwnerId,
        SkillIds = p.RequiredSkills?.Select(s => s.SkillId).ToList() ?? new List<Guid>(),
        TeamMembers = p.Team?.Select(t => new ProjectTeamMemberDto
        {
            Id = t.Id,
            EmployeeId = t.EmployeeId,
            Role = t.Role,
            StartDate = t.StartDate,
            EndDate = t.EndDate
        }).ToList() ?? new List<ProjectTeamMemberDto>(),
        CreatedAt = p.CreatedAt,
        UpdatedAt = p.UpdatedAt
    };
}
