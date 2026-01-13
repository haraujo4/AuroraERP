using Aurora.Application.DTOs.HR;
using Aurora.Application.Interfaces.HR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Aurora.API.Controllers.HR
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        public EmployeesController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _employeeService.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _employeeService.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateEmployeeDto request)
        {
            var result = await _employeeService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateEmployeeDto request)
        {
            var result = await _employeeService.UpdateAsync(id, request);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Deactivate(Guid id)
        {
            var success = await _employeeService.DeactivateAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }

        // Master Data Endpoints
        [HttpGet("departments")]
        public async Task<IActionResult> GetDepartments()
        {
            var result = await _employeeService.GetDepartmentsAsync();
            return Ok(result);
        }

        [HttpPost("departments")]
        public async Task<IActionResult> CreateDepartment([FromBody] CreateDepartmentDto request)
        {
            var result = await _employeeService.CreateDepartmentAsync(request);
            return Ok(result);
        }

        [HttpGet("job-titles")]
        public async Task<IActionResult> GetJobTitles()
        {
            var result = await _employeeService.GetJobTitlesAsync();
            return Ok(result);
        }

        [HttpPost("job-titles")]
        public async Task<IActionResult> CreateJobTitle([FromBody] CreateJobTitleDto request)
        {
            var result = await _employeeService.CreateJobTitleAsync(request);
            return Ok(result);
        }
    }
}
