using Aurora.Application.DTOs.HR;
using Aurora.Application.Interfaces.HR;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Application.Interfaces.Events;
using Aurora.Domain.Entities.HR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Aurora.Application.Services.HR
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IRepository<Employee> _employeeRepo;
        private readonly IRepository<Department> _deptRepo;
        private readonly IRepository<JobTitle> _jobRepo;
        private readonly IEventBus _eventBus;

        public EmployeeService(IRepository<Employee> employeeRepo, IRepository<Department> deptRepo, IRepository<JobTitle> jobRepo, IEventBus eventBus)
        {
            _employeeRepo = employeeRepo;
            _deptRepo = deptRepo;
            _jobRepo = jobRepo;
            _eventBus = eventBus;
        }

        public async Task<IEnumerable<EmployeeDto>> GetAllAsync()
        {
            var employees = await _employeeRepo.GetAllAsync(e => e.JobTitle, e => e.Department);
            return employees.Select(MapToDto);
        }

        public async Task<EmployeeDto?> GetByIdAsync(Guid id)
        {
            var employee = await _employeeRepo.GetByIdAsync(id, e => e.JobTitle, e => e.Department);
            return employee == null ? null : MapToDto(employee);
        }

        public async Task<EmployeeDto> CreateAsync(CreateEmployeeDto request)
        {
            var employee = new Employee(
                request.FullName,
                request.Email,
                request.Phone,
                request.BirthDate,
                request.HireDate,
                request.Salary,
                request.JobTitleId,
                request.DepartmentId,
                request.Address
            );

            await _employeeRepo.AddAsync(employee);
            
            var job = await _jobRepo.GetByIdAsync(request.JobTitleId);
            var dept = await _deptRepo.GetByIdAsync(request.DepartmentId);
            
            // Trigger Event
            await _eventBus.PublishAsync(new Aurora.Application.Events.HR.EmployeeAdmittedEvent(employee.FullName, dept?.Name ?? "N/A"));

            return new EmployeeDto
            {
                Id = employee.Id,
                FullName = employee.FullName,
                Email = employee.Email,
                Phone = employee.Phone,
                BirthDate = employee.BirthDate,
                HireDate = employee.HireDate,
                Salary = employee.Salary,
                IsActive = employee.IsActive,
                JobTitleId = employee.JobTitleId,
                JobTitleName = job?.Title ?? "Unknown",
                DepartmentId = employee.DepartmentId,
                DepartmentName = dept?.Name ?? "Unknown",
                Address = employee.Address
            };
        }

        public async Task<EmployeeDto?> UpdateAsync(Guid id, UpdateEmployeeDto request)
        {
            var employee = await _employeeRepo.GetByIdAsync(id, e => e.JobTitle, e => e.Department);
            if (employee == null) return null;

            employee.UpdateDetails(request.FullName, request.Email, request.Phone, request.Address);
            if (!request.IsActive && employee.IsActive) employee.Deactivate();

            await _employeeRepo.UpdateAsync(employee);
            return MapToDto(employee);
        }

        public async Task<bool> DeactivateAsync(Guid id)
        {
            var employee = await _employeeRepo.GetByIdAsync(id);
            if (employee == null) return false;

            employee.Deactivate();
            await _employeeRepo.UpdateAsync(employee);
            return true;
        }

        // Master Data
        public async Task<IEnumerable<DepartmentDto>> GetDepartmentsAsync()
        {
            var depts = await _deptRepo.GetAllAsync();
            return depts.Select(d => new DepartmentDto
            {
                Id = d.Id,
                Name = d.Name,
                Description = d.Description,
                ManagerId = d.ManagerId
            });
        }

        public async Task<DepartmentDto> CreateDepartmentAsync(CreateDepartmentDto request)
        {
            var dept = new Department(request.Name, request.Description, request.ManagerId);
            await _deptRepo.AddAsync(dept);
            return new DepartmentDto
            {
                Id = dept.Id,
                Name = dept.Name,
                Description = dept.Description,
                ManagerId = dept.ManagerId
            };
        }

        public async Task<IEnumerable<JobTitleDto>> GetJobTitlesAsync()
        {
            var jobs = await _jobRepo.GetAllAsync(j => j.Department);
            return jobs.Select(j => new JobTitleDto
            {
                Id = j.Id,
                Title = j.Title,
                Description = j.Description,
                BaseSalary = j.BaseSalary,
                DepartmentId = j.DepartmentId,
                DepartmentName = j.Department?.Name ?? "Unknown"
            });
        }

        public async Task<JobTitleDto> CreateJobTitleAsync(CreateJobTitleDto request)
        {
            var job = new JobTitle(request.Title, request.DepartmentId, request.BaseSalary, request.Description);
            await _jobRepo.AddAsync(job);
            
            // Fetch Dept Name
            var dept = await _deptRepo.GetByIdAsync(request.DepartmentId);
            
            return new JobTitleDto
            {
                Id = job.Id,
                Title = job.Title,
                Description = job.Description,
                BaseSalary = job.BaseSalary,
                DepartmentId = job.DepartmentId,
                DepartmentName = dept?.Name ?? "Unknown"
            };
        }

        private static EmployeeDto MapToDto(Employee e)
        {
            return new EmployeeDto
            {
                Id = e.Id,
                FullName = e.FullName,
                Email = e.Email,
                Phone = e.Phone,
                BirthDate = e.BirthDate,
                HireDate = e.HireDate,
                Salary = e.Salary,
                IsActive = e.IsActive,
                JobTitleId = e.JobTitleId,
                JobTitleName = e.JobTitle?.Title ?? "Unknown",
                DepartmentId = e.DepartmentId,
                DepartmentName = e.Department?.Name ?? "Unknown",
                Address = e.Address
            };
        }
    }
}
