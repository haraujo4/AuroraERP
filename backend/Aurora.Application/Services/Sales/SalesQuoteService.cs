using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aurora.Application.DTOs.Sales;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Application.Interfaces.Sales;
using Aurora.Application.Interfaces.Services;
using Aurora.Application.Interfaces.Fiscal;
using Aurora.Domain.Enums;
using Aurora.Domain.Entities.Sales;

namespace Aurora.Application.Services.Sales
{
    public class SalesQuoteService : ISalesQuoteService
    {
        private readonly ISalesQuoteRepository _repository;
        private readonly IBusinessPartnerRepository _bpRepository;
        private readonly IOpportunityRepository _oppRepository;
        private readonly IRepository<Aurora.Domain.Entities.Logistics.Material> _materialRepository; // Direct usage for simplicity
        private readonly IPricingService _pricingService;
        private readonly Aurora.Application.Interfaces.Common.ICodeGenerationService _codeGenService;
        private readonly Aurora.Application.Interfaces.Events.IEventBus _eventBus;
        private readonly IPdfService _pdfService;
        private readonly IEmailQueue _emailQueue;
        private readonly IEmpresaRepository _empresaRepository;
        private readonly ITaxService _taxService;

        public SalesQuoteService(
            ISalesQuoteRepository repository, 
            IBusinessPartnerRepository bpRepository, 
            IOpportunityRepository oppRepository, 
            IRepository<Aurora.Domain.Entities.Logistics.Material> materialRepository,
            IPricingService pricingService,
            Aurora.Application.Interfaces.Common.ICodeGenerationService codeGenService,
            Aurora.Application.Interfaces.Events.IEventBus eventBus,
            IPdfService pdfService,
            IEmailQueue emailQueue,
            IEmpresaRepository empresaRepository,
            ITaxService taxService)
        {
            _repository = repository;
            _bpRepository = bpRepository;
            _oppRepository = oppRepository;
            _materialRepository = materialRepository;
            _pricingService = pricingService;
            _codeGenService = codeGenService;
            _eventBus = eventBus;
            _pdfService = pdfService;
            _emailQueue = emailQueue;
            _empresaRepository = empresaRepository;
            _taxService = taxService;
        }

        public async Task<IEnumerable<SalesQuoteDto>> GetAllAsync()
        {
            var quotes = await _repository.GetAllWithDetailsAsync();
            return quotes.Select(MapToDto);
        }

        public async Task<SalesQuoteDto> GetByIdAsync(Guid id)
        {
            var quote = await _repository.GetByIdWithDetailsAsync(id);
            if (quote == null) return null;
            return MapToDto(quote);
        }

        public async Task<SalesQuoteDto> CreateAsync(CreateSalesQuoteDto dto)
        {
            var number = await _codeGenService.GenerateNextCodeAsync<SalesQuote>("QT");
            
            var quote = new SalesQuote(number, dto.BusinessPartnerId, dto.ValidUntil, dto.OpportunityId);
            
            if (Enum.TryParse<FreightType>(dto.FreightType, out var freightType))
            {
                quote.UpdateHeader(dto.PaymentCondition ?? "A Vista", freightType);
            }
            else
            {
                quote.UpdateHeader(dto.PaymentCondition ?? "A Vista", FreightType.FOB);
            }

            foreach (var itemDto in dto.Items)
            {
                var unitPrice = itemDto.UnitPrice;
                var discount = itemDto.DiscountPercentage;

                if (unitPrice == 0)
                {
                    var pricing = await _pricingService.CalculatePricingAsync(itemDto.MaterialId, dto.BusinessPartnerId, itemDto.Quantity);
                    unitPrice = pricing.BasePrice;
                    discount = pricing.DiscountPercentage;
                }

                quote.AddItem(itemDto.MaterialId, itemDto.Quantity, unitPrice, discount, itemDto.IpiRate, itemDto.IcmsRate);
            }

            await _repository.AddAsync(quote);
            
            // Reload with details for DTO mapping
            var createdQuote = await _repository.GetByIdWithDetailsAsync(quote.Id);
            var quoteDto = MapToDto(createdQuote);

            // Generate PDF and Send Email asynchronously
            try 
            {
                var companies = await _empresaRepository.GetAllAsync();
                var company = companies.FirstOrDefault(); // Taking first one for now as context is single-tenant-ish
                if (company != null)
                {
                    // Add date to DTO since it might not be in the MapToDto if not persisted/refreshed fully? 
                    // Actually MapToDto uses entity data.
                    
                    
                    var pdfBytes = _pdfService.GenerateSalesQuotePdf(quoteDto, company);
                    
                    // Send Email
                    var bp = await _bpRepository.GetByIdAsync(dto.BusinessPartnerId, b => b.Contacts);
                    var email = bp?.Contacts.FirstOrDefault()?.Email;

                    if (!string.IsNullOrEmpty(email))
                    {
                        await _emailQueue.EnqueueAsync(new Aurora.Domain.Models.EmailMessage
                        {
                            To = email,
                            Subject = $"Orçamento {quote.Number} - {company.RazaoSocial}",
                            Body = $"Seguem em anexo os detalhes do orçamento {quote.Number}.\n\nAtenciosamente,\n{company.RazaoSocial}",
                            IsHtml = false,
                            Attachments = new List<Aurora.Domain.Models.EmailAttachment>
                            {
                                new Aurora.Domain.Models.EmailAttachment
                                {
                                    FileName = $"Orcamento_{quote.Number}.pdf",
                                    Content = pdfBytes,
                                    ContentType = "application/pdf"
                                }
                            }
                        });
                    }
                }
            }
            catch(Exception ex)
            {
                // Non-blocking error
                Console.WriteLine($"Error sending quote email: {ex.Message}");
            }

            return quoteDto;
        }

        public async Task UpdateStatusAsync(Guid id, string status)
        {
            var quote = await _repository.GetByIdAsync(id);
            if (quote == null) throw new Exception("Quote not found");

            if (Enum.TryParse<SalesQuoteStatus>(status, out var newStatus))
            {
                quote.UpdateStatus(newStatus);
                await _repository.UpdateAsync(quote);

                if (newStatus == SalesQuoteStatus.Accepted)
                {
                    var bp = await _bpRepository.GetByIdAsync(quote.BusinessPartnerId, b => b.Contacts);
                    var contactEmail = bp?.Contacts.FirstOrDefault()?.Email;
                    
                    if (!string.IsNullOrEmpty(contactEmail))
                    {
                        var evt = new Aurora.Application.Events.Sales.SalesQuoteApprovedEvent(
                            quote.Id, 
                            bp?.RazaoSocial ?? "Cliente", 
                            contactEmail, 
                            quote.TotalValue
                        );
                        await _eventBus.PublishAsync(evt);
                    }
                }
            }
            else
            {
                throw new Exception("Invalid Status");
            }
        }

        private SalesQuoteDto MapToDto(SalesQuote entity)
        {
            return new SalesQuoteDto
            {
                Id = entity.Id,
                Number = entity.Number,
                BusinessPartnerId = entity.BusinessPartnerId,
                BusinessPartnerName = entity.BusinessPartner != null ? entity.BusinessPartner.RazaoSocial : "Unknown",
                OpportunityId = entity.OpportunityId,
                OpportunityTitle = entity.Opportunity != null ? entity.Opportunity.Title : null,
                QuoteDate = entity.CreatedAt,
                ValidUntil = entity.ValidUntil,
                Status = entity.Status.ToString(),
                TotalValue = entity.TotalValue,
                PaymentCondition = entity.PaymentCondition,
                FreightType = entity.FreightType.ToString(),
                Items = entity.Items.Select(i => new SalesQuoteItemDto
                {
                    Id = i.Id,
                    MaterialId = i.MaterialId,
                    MaterialName = i.Material != null ? i.Material.Description : "Unknown",
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    DiscountPercentage = i.DiscountPercentage,
                    IpiRate = i.IpiRate,
                    IpiValue = i.IpiValue,
                    IcmsRate = i.IcmsRate,
                    IcmsValue = i.IcmsValue,
                    TotalValue = i.TotalValue
                }).ToList()
            };
        }

        public async Task<SimulatedTaxResultDto> SimulateTaxAsync(DTOs.Sales.SimulateTaxDto dto)
        {
            var company = (await _empresaRepository.GetAllAsync()).FirstOrDefault();
            if (company == null) throw new Exception("Company settings not found");

            var material = await _materialRepository.GetByIdAsync(dto.MaterialId);
            if (material == null) throw new Exception("Material not found");

            var bp = await _bpRepository.GetByIdAsync(dto.BusinessPartnerId); // Need to ensure addresses are loaded? 
            // Generic repo might not load sub-collections unless specified. 
            // _bpRepository might have specific Get methods. 
            // But let's check repo interface or implementation.
            // Actually _bpRepository.GetByIdAsync(id, includeProperties) is used elsewhere.
            // Let's rely on that if available, or just GetByIdAsync and hope.
            // Wait, checking line 113: await _bpRepository.GetByIdAsync(dto.BusinessPartnerId, b => b.Contacts);
            // So I should use: await _bpRepository.GetByIdAsync(dto.BusinessPartnerId, b => b.Addresses);

            // Re-fetching properly
            bp = await _bpRepository.GetByIdAsync(dto.BusinessPartnerId, b => b.Addresses);
            if (bp == null) throw new Exception("Business Partner not found");

            var sourceState = company.EnderecoFiscal?.State ?? "SP"; // Fallback to SP
            
            // Logic to pick address: Delivery ? Principal ? First?
            // "Delivery" type is common.
            var destAddress = bp.Addresses.FirstOrDefault(a => a.Type == "Entrega")?.Address 
                              ?? bp.Addresses.FirstOrDefault(a => a.IsPrincipal)?.Address
                              ?? bp.Addresses.FirstOrDefault()?.Address;
            
            var destState = destAddress?.State ?? sourceState; // Intra-state fallback if no address

            var input = new Aurora.Application.DTOs.Fiscal.TaxCalculationInputDto
            {
                SourceState = sourceState,
                DestState = destState,
                NcmCode = material.TaxClassification,
                OperationType = OperationType.Sales,
                ItemValue = dto.Quantity * dto.UnitPrice // Assuming item value for this calculation context (maybe not needed for RATE lookup but for AMOUNT)
            };

            var taxResult = await _taxService.CalculateTaxAsync(input);

            return new SimulatedTaxResultDto
            {
                IpiRate = taxResult.IpiRate,
                IpiValue = taxResult.IpiAmount,
                IcmsRate = taxResult.IcmsRate,
                IcmsValue = taxResult.IcmsAmount,
                Cfop = taxResult.Cfop,
                CstIcms = taxResult.CstIcms
            };
        }
    }
}
