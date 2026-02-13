using Microsoft.EntityFrameworkCore;
using PeopleAnalytics.Api.Data;
using PeopleAnalytics.Api.Models;

namespace PeopleAnalytics.Api.Services;

public class EmployeeService
{
    private readonly AppDbContext _db;

    public EmployeeService(AppDbContext db) => _db = db;

    public async Task<List<EmployeeDto>> GetAllAsync()
    {
        var list = await _db.Employees
            .AsNoTracking()
            .Include(e => e.Department)
            .Include(e => e.Position)
            .OrderBy(e => e.Name)
            .ToListAsync();
        return list.Select(MapToDto).ToList();
    }

    public async Task<EmployeeDto?> GetByIdAsync(Guid id)
    {
        var e = await _db.Employees
            .AsNoTracking()
            .Include(x => x.Department)
            .Include(x => x.Position)
            .FirstOrDefaultAsync(x => x.Id == id);
        if (e == null) return null;
        return MapToDto(e);
    }

    public async Task<EmployeeDto?> CreateAsync(CreateEmployeeDto dto)
    {
        var e = new Data.Entities.Employee
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Email = dto.Email,
            Phone = dto.Phone,
            HireDate = dto.HireDate,
            DepartmentId = dto.DepartmentId,
            PositionId = dto.PositionId,
            ManagerId = dto.ManagerId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Employees.Add(e);
        await _db.SaveChangesAsync();
        return await GetByIdAsync(e.Id);
    }

    public async Task<EmployeeDto?> UpdateAsync(Guid id, UpdateEmployeeDto dto)
    {
        var e = await _db.Employees.FindAsync(id);
        if (e == null) return null;
        if (dto.Name != null) e.Name = dto.Name;
        if (dto.Email != null) e.Email = dto.Email;
        if (dto.Phone != null) e.Phone = dto.Phone;
        if (dto.HireDate.HasValue) e.HireDate = dto.HireDate.Value;
        if (dto.DepartmentId.HasValue) e.DepartmentId = dto.DepartmentId.Value;
        if (dto.PositionId.HasValue) e.PositionId = dto.PositionId.Value;
        if (dto.ManagerId.HasValue) e.ManagerId = dto.ManagerId;
        if (dto.Status != null) e.Status = dto.Status;
        e.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return await GetByIdAsync(id);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var e = await _db.Employees.FindAsync(id);
        if (e == null) return false;
        _db.Employees.Remove(e);
        await _db.SaveChangesAsync();
        return true;
    }

    private static EmployeeDto MapToDto(Data.Entities.Employee e) => new()
    {
        Id = e.Id,
        Name = e.Name,
        Email = e.Email,
        Phone = e.Phone,
        HireDate = e.HireDate,
        DepartmentId = e.DepartmentId,
        PositionId = e.PositionId,
        ManagerId = e.ManagerId,
        Status = e.Status,
        DepartmentName = e.Department?.Name,
        PositionTitle = e.Position?.Title,
        CreatedAt = e.CreatedAt,
        UpdatedAt = e.UpdatedAt
    };
}
