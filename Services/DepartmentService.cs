using Microsoft.EntityFrameworkCore;
using PeopleAnalytics.Api.Data;
using PeopleAnalytics.Api.Data.Entities;
using PeopleAnalytics.Api.Models;

namespace PeopleAnalytics.Api.Services;

public class DepartmentService
{
    private readonly AppDbContext _db;

    public DepartmentService(AppDbContext db) => _db = db;

    public async Task<List<DepartmentDto>> GetAllAsync()
    {
        var list = await _db.Departments
            .Include(d => d.Positions)
            .Include(d => d.Employees)
            .OrderBy(d => d.Name)
            .ToListAsync();
        return list.Select(Map).ToList();
    }

    public async Task<DepartmentDto?> GetByIdAsync(Guid id)
    {
        var d = await _db.Departments
            .Include(x => x.Positions)
            .Include(x => x.Employees)
            .FirstOrDefaultAsync(x => x.Id == id);
        return d == null ? null : Map(d);
    }

    public async Task<DepartmentDto> CreateAsync(CreateDepartmentDto dto)
    {
        var d = new Department
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Description = dto.Description,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Departments.Add(d);
        await _db.SaveChangesAsync();
        return (await GetByIdAsync(d.Id))!;
    }

    public async Task<DepartmentDto?> UpdateAsync(Guid id, UpdateDepartmentDto dto)
    {
        var d = await _db.Departments.FindAsync(id);
        if (d == null) return null;
        if (dto.Name != null) d.Name = dto.Name;
        if (dto.Description != null) d.Description = dto.Description;
        d.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return await GetByIdAsync(id);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var d = await _db.Departments.FindAsync(id);
        if (d == null) return false;
        _db.Departments.Remove(d);
        await _db.SaveChangesAsync();
        return true;
    }

    private static DepartmentDto Map(Department d) => new()
    {
        Id = d.Id,
        Name = d.Name,
        Description = d.Description,
        PositionIds = d.Positions?.Select(p => p.Id).ToList() ?? new List<Guid>(),
        EmployeeIds = d.Employees?.Select(e => e.Id).ToList() ?? new List<Guid>(),
        CreatedAt = d.CreatedAt,
        UpdatedAt = d.UpdatedAt
    };
}
