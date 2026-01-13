using Aurora.Application.DTOs.HR;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Aurora.Application.Interfaces.HR
{
    public interface IEmployeeService
    {
        Task<IEnumerable<EmployeeDto>> GetAllAsync();
        Task<EmployeeDto?> GetByIdAsync(Guid id);
        Task<EmployeeDto> CreateAsync(CreateEmployeeDto request);
        Task<EmployeeDto?> UpdateAsync(Guid id, UpdateEmployeeDto request);
        Task<bool> DeactivateAsync(Guid id);
        
        // Master Data
        Task<IEnumerable<DepartmentDto>> GetDepartmentsAsync();
        Task<DepartmentDto> CreateDepartmentAsync(CreateDepartmentDto request);
        
        Task<IEnumerable<JobTitleDto>> GetJobTitlesAsync();
        Task<JobTitleDto> CreateJobTitleAsync(CreateJobTitleDto request);
    }
}
