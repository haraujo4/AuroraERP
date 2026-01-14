using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Finance;
using Microsoft.AspNetCore.Mvc;

namespace Aurora.API.Controllers.Finance
{
    [ApiController]
    [Route("api/finance/invoices")]
    public class InvoiceController : ControllerBase
    {
        private readonly IInvoiceService _invoiceService;
        private readonly Aurora.Application.Interfaces.Fiscal.IFiscalService _fiscalService;

        public InvoiceController(IInvoiceService invoiceService, Aurora.Application.Interfaces.Fiscal.IFiscalService fiscalService)
        {
            _invoiceService = invoiceService;
            _fiscalService = fiscalService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<InvoiceDto>>> GetAll()
        {
            var invoices = await _invoiceService.GetAllAsync();
            return Ok(invoices);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<InvoiceDto>> GetById(Guid id)
        {
            var invoice = await _invoiceService.GetByIdAsync(id);
            if (invoice == null) return NotFound();
            return Ok(invoice);
        }

        [HttpPost]
        public async Task<ActionResult<InvoiceDto>> Create(CreateInvoiceDto dto)
        {
            try
            {
                var created = await _invoiceService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("from-purchase-order")]
        public async Task<ActionResult<InvoiceDto>> CreateFromPurchaseOrder([FromBody] CreateFromPurchaseOrderRequest request)
        {
            try
            {
                var created = await _invoiceService.CreateFromPurchaseOrderAsync(request.PurchaseOrderId, request.IssueDate, request.DueDate);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("from-sales-order")]
        public async Task<ActionResult<InvoiceDto>> CreateFromSalesOrder([FromBody] CreateFromSalesOrderRequest request)
        {
            try
            {
                var created = await _invoiceService.CreateFromSalesOrderAsync(request.SalesOrderId, request.IssueDate, request.DueDate);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        public class CreateFromPurchaseOrderRequest
        {
            public Guid PurchaseOrderId { get; set; }
            public DateTime IssueDate { get; set; }
            public DateTime DueDate { get; set; }
        }

        public class CreateFromSalesOrderRequest
        {
            public Guid SalesOrderId { get; set; }
            public DateTime IssueDate { get; set; }
            public DateTime DueDate { get; set; }
        }

        [HttpPost("{id}/post")]
        public async Task<IActionResult> Post(Guid id)
        {
            try
            {
                await _invoiceService.PostAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("{id}/cancel")]
        public async Task<IActionResult> Cancel(Guid id, [FromBody] CancelInvoiceRequest request)
        {
            try
            {
                // We need to determine if we should just cancel the invoice (Draft) or specific fiscal cancellation (Posted)
                // For simplicity, let's assume the frontend calls this for Fiscal Cancellation if status is Posted.
                // But wait, the existing Cancel endpoint might be used for Drafts.
                // Let's rely on Service logic or check status here?
                // Ideally, FiscalService handles it.
                // I need to inject IFiscalService.
                
                // Oops, I need to add IFiscalService to constructor first.
                // I will use a separate ReplaceFileContent for constructor.
                // Here I am just replacing the method.
                
                await _fiscalService.CancelInvoiceAsync(id, request.Reason); 
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        public class CancelInvoiceRequest
        {
            public string Reason { get; set; }
        }
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                await _invoiceService.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
