using Microsoft.AspNetCore.Mvc;
using Aurora.Application.Interfaces.Finance;

namespace Aurora.API.Controllers.Finance
{
    [ApiController]
    [Route("api/finance/[controller]")]
    public class JournalEntryController : ControllerBase
    {
        private readonly IJournalEntryService _service;

        public JournalEntryController(IJournalEntryService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var entries = await _service.GetAllAsync();
            return Ok(entries);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                var entry = await _service.GetByIdAsync(id);
                return Ok(entry);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateJournalEntryDto dto)
        {
            try
            {
                var entry = await _service.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = entry.Id }, entry);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{id}/post")]
        public async Task<IActionResult> Post(Guid id)
        {
            try
            {
                await _service.PostAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
