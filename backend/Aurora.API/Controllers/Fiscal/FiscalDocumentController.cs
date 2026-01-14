using System;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Fiscal;
using Microsoft.AspNetCore.Mvc;

namespace Aurora.API.Controllers.Fiscal
{
    [ApiController]
    [Route("api/fiscal/documents")]
    public class FiscalDocumentController : ControllerBase
    {
        private readonly IFiscalDocumentService _service;

        public FiscalDocumentController(IFiscalDocumentService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }

        [HttpGet("invoice/{invoiceId}")]
        public async Task<IActionResult> GetByInvoice(Guid invoiceId)
        {
            var doc = await _service.GetByInvoiceIdAsync(invoiceId);
            if (doc == null) return NotFound();
            return Ok(doc);
        }

        [HttpPost("{invoiceId}/generate")]
        public async Task<IActionResult> Generate(Guid invoiceId)
        {
            try
            {
                var doc = await _service.GenerateFromInvoiceAsync(invoiceId);
                return Ok(doc);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("invoice/{invoiceId}/pdf")]
        public async Task<IActionResult> GetPdf(Guid invoiceId)
        {
            Console.WriteLine($"[PDF] Request received for invoice: {invoiceId}");
            try
            {
                var bytes = await _service.GetPdfBytesByInvoiceIdAsync(invoiceId);
                Console.WriteLine($"[PDF] Returning {bytes.Length} bytes for invoice: {invoiceId}");
                return File(bytes, "application/pdf", $"NFe_{invoiceId}.pdf");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{id}/cancel")]
        public async Task<IActionResult> Cancel(Guid id)
        {
            await _service.CancelAsync(id);
            return Ok();
        }
    }
}
