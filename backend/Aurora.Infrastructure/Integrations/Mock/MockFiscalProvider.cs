using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Aurora.Application.Interfaces.Fiscal;
using Aurora.Domain.Entities.Fiscal;
using Aurora.Domain.Entities.Finance;
using Aurora.Domain.Entities.BusinessPartners;
using Microsoft.Extensions.Caching.Memory;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using Aurora.Application.Interfaces.Repositories;

namespace Aurora.Infrastructure.Integrations.Mock
{
    public class MockFiscalProvider : IFiscalProvider
    {
        private readonly IMemoryCache _cache;
        private readonly IEmpresaRepository _empresaRepository;

        public MockFiscalProvider(IMemoryCache cache, IEmpresaRepository empresaRepository)
        {
            _cache = cache;
            _empresaRepository = empresaRepository;
            QuestPDF.Settings.License = LicenseType.Community;
        }

        public async Task<string> EmitirNfeAsync(FiscalDocument document, Invoice invoice, BusinessPartner bp)
        {
            var providerRef = Guid.NewGuid().ToString();
            var company = (await _empresaRepository.GetAllAsync()).FirstOrDefault();
            
            // Generate PDF
            var pdfBytes = GeneratePdf(invoice, bp, company);
            _cache.Set($"pdf_{providerRef}", pdfBytes, TimeSpan.FromHours(1));

            // Generate XML
            var xmlContent = GenerateXml(invoice, bp, company);
            _cache.Set($"xml_{providerRef}", xmlContent, TimeSpan.FromHours(1));

            return providerRef;
        }

        public Task<FiscalDocumentStatusResponse> ConsultarNfeAsync(string providerReference)
        {
            // Always authorized
            return Task.FromResult(new FiscalDocumentStatusResponse
            {
                Status = "Authorized",
                Protocol = new Random().Next(100000000, 999999999).ToString(),
                Message = "Autorizado com sucesso (Ambiente de Homologação/Mock)",
                PdfUrl = $"mock://pdf/{providerReference}",
                XmlUrl = $"mock://xml/{providerReference}"
            });
        }

        public async Task<byte[]> GetPdfBytesAsync(string providerReference, Invoice? invoice = null)
        {
            if (_cache.TryGetValue($"pdf_{providerReference}", out byte[] bytes))
            {
                return bytes;
            }
            
            if (invoice != null)
            {
                var company = (await _empresaRepository.GetAllAsync()).FirstOrDefault();
                var bp = invoice.BusinessPartner ?? new BusinessPartner("MOCK", BusinessPartnerType.PessoaJuridica, "Cliente não identificado", "Cliente", "00000000000");
                return GeneratePdf(invoice, bp, company);
            }

            throw new Exception("PDF expired or not found in mock cache.");
        }

        public async Task<string> GetXmlContentAsync(string providerReference, Invoice? invoice = null)
        {
            if (_cache.TryGetValue($"xml_{providerReference}", out string xml))
            {
                return xml;
            }

            if (invoice != null)
            {
                var company = (await _empresaRepository.GetAllAsync()).FirstOrDefault();
                var bp = invoice.BusinessPartner ?? new BusinessPartner("MOCK", BusinessPartnerType.PessoaJuridica, "Cliente não identificado", "Cliente", "00000000000");
                return GenerateXml(invoice, bp, company);
            }

            throw new Exception("XML expired or not found in mock cache.");
        }

        public Task CancelarNfeAsync(FiscalDocument document, string reason)
        {
            // Mock: Just Task.CompletedTask as we handle status update in service
            // Or we could log it.
            return Task.CompletedTask;
        }

        private byte[] GeneratePdf(Invoice invoice, BusinessPartner bp, Aurora.Domain.Entities.Organization.Empresa company)
        {
            // Determine type: Service (NFS-e) or Product (NF-e)
            // Simplistic rule: If any item seems like service? Or just rely on Type.
            // Assuming Product for now unless explicitly Service.
            // Let's look at Invoice or Items. Material 'Type' property?
            // For now, I'll default to Product (DANFE) style but include Service fields if needed.
            // Actually, user gave TWO images. One for Service, one for Product.
            // We need to pick one.
            // Let's assume generic "Product" layout for now, or check first item.
            // Ideally: Invoice type should say.
            
            bool isService = false; // logic to detect service
            
            var doc = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(1, Unit.Centimetre);
                    page.DefaultTextStyle(x => x.FontSize(9)); // Small text for invoices

                    page.Header().Element(header => 
                    {
                        header.Column(col => 
                        {
                           col.Item().Row(row => 
                           {
                               row.RelativeItem().Column(c => 
                               {
                                   c.Item().Text(isService ? "PREFEITURA MUNICIPAL - NOTA FISCAL DE SERVIÇOS" : "DANFE - DOCUMENTO AUXILIAR DA NOTA FISCAL ELETRÔNICA").Bold().FontSize(14);
                                   c.Item().Text("CONSULTA DE AUTENTICIDADE NO PORTAL NACIONAL").FontSize(8);
                               });
                               row.ConstantItem(100).Text("[QR CODE]").FontSize(8).AlignCenter();
                           });
                           
                           col.Item().PaddingVertical(5).BorderBottom(1).BorderColor(Colors.Black);
                           
                           col.Item().Text("SEM VALOR FISCAL - AMBIENTE DE HOMOLOGAÇÃO")
                               .FontSize(20).FontColor(Colors.Red.Medium).Bold().AlignCenter();
                           
                           col.Item().PaddingVertical(5).BorderBottom(1).BorderColor(Colors.Black);
                        });
                    });

                    page.Content().Column(col =>
                    {
                        // Emitente
                        col.Item().Border(1).Padding(5).Column(c => 
                        {
                            c.Item().Text("EMITENTE / PRESTADOR").Bold();
                            c.Item().Text(company?.RazaoSocial ?? "EMPRESA MODELO LTDA").FontSize(10).Bold();
                            c.Item().Text($"{company?.CNPJ} - {company?.InscricaoEstadual}");
                            c.Item().Text($"{company?.EnderecoFiscal?.Street}, {company?.EnderecoFiscal?.Number} - {company?.EnderecoFiscal?.City}/{company?.EnderecoFiscal?.State}");
                        });

                        col.Item().Height(5);

                        // Destinatario
                        col.Item().Border(1).Padding(5).Column(c => 
                        {
                            c.Item().Text("DESTINATÁRIO / TOMADOR").Bold();
                            c.Item().Text(bp?.RazaoSocial ?? "CLIENTE CONSUMIDOR").FontSize(10).Bold();
                            c.Item().Text(bp?.CpfCnpj);
                            // c.Item().Text(bp?.Addresses...);
                        });

                        col.Item().Height(10);

                        // Items
                        col.Item().Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.ConstantColumn(30); // Seq
                                columns.RelativeColumn();   // Desc
                                columns.ConstantColumn(40); // Qtd
                                columns.ConstantColumn(60); // Unit
                                columns.ConstantColumn(60); // Total
                            });

                            table.Header(header =>
                            {
                                header.Cell().Text("#").Bold();
                                header.Cell().Text("DESCRIÇÃO").Bold();
                                header.Cell().Text("QTD").Bold();
                                header.Cell().Text("VL. UNIT").Bold();
                                header.Cell().Text("TOTAL").Bold();
                            });

                            foreach (var item in invoice.Items.Select((x, i) => new { x, i }))
                            {
                                table.Cell().Text((item.i + 1).ToString());
                                table.Cell().Text(item.x.Description);
                                table.Cell().Text(item.x.Quantity.ToString("F2"));
                                table.Cell().Text($"R$ {item.x.UnitPrice:F2}");
                                table.Cell().Text($"R$ {item.x.TotalAmount:F2}");
                            }
                        });
                        
                        col.Item().PaddingTop(10).LineHorizontal(1);

                        // Totals
                        col.Item().Row(row => 
                        {
                            row.RelativeItem().Text("Base Cálculo ICMS/ISS:").AlignRight();
                            row.ConstantItem(80).Text($"R$ {invoice.GrossAmount:F2}").AlignRight();
                        });
                        col.Item().Row(row => 
                        {
                            row.RelativeItem().Text("Valor Total Impostos:").AlignRight();
                            row.ConstantItem(80).Text($"R$ {invoice.TaxAmount:F2}").AlignRight();
                        });
                        col.Item().Row(row => 
                        {
                            row.RelativeItem().Text("VALOR TOTAL DA NOTA:").Bold().AlignRight();
                            row.ConstantItem(80).Text($"R$ {invoice.NetAmount + invoice.TaxAmount:F2}").Bold().AlignRight();
                        });

                    });

                    page.Footer().AlignCenter().Text(x => 
                    {
                        x.Span("Gerado por Aurora ERP - Módulo Fiscal Mock");
                        x.CurrentPageNumber();
                    });
                });
            });

            return doc.GeneratePdf();
        }

        private string GenerateXml(Invoice invoice, BusinessPartner bp, Aurora.Domain.Entities.Organization.Empresa company)
        {
            // Simple Mock XML
            return $@"<?xml version=""1.0"" encoding=""UTF-8""?>
<nfeProc versao=""4.00"" xmlns=""http://www.portalfiscal.inf.br/nfe"">
    <NFe>
        <infNFe Id=""NFe{new Random().Next(1000,9999)}"">
            <ide>
                <cUF>35</cUF>
                <cNF>{new Random().Next(100000,999999)}</cNF>
                <natOp>VENDA</natOp>
                <mod>55</mod>
                <serie>1</serie>
                <nNF>{invoice.Number}</nNF>
                <dhEmi>{DateTime.Now:yyyy-MM-ddTHH:mm:ss}</dhEmi>
            </ide>
            <emit>
                <CNPJ>{company?.CNPJ}</CNPJ>
                <xNome>{company?.RazaoSocial ?? "Empresa Mock"}</xNome>
            </emit>
            <dest>
                <CNPJ>{bp?.CpfCnpj}</CNPJ>
                <xNome>{bp?.RazaoSocial}</xNome>
            </dest>
            <det nItem=""1"">
                <prod>
                    <xProd>MOCK PRODUCT</xProd>
                    <vProd>{invoice.GrossAmount}</vProd>
                </prod>
            </det>
            <total>
                <ICMSTot>
                    <vNF>{invoice.GrossAmount}</vNF>
                </ICMSTot>
            </total>
        </infNFe>
    </NFe>
    <protNFe>
        <infProt>
            <chNFe>{Guid.NewGuid()}</chNFe>
            <dhRecbto>{DateTime.Now:yyyy-MM-ddTHH:mm:ss}</dhRecbto>
            <xMotivo>Autorizado o uso da NF-e (Ambiente Mock)</xMotivo>
        </infProt>
    </protNFe>
</nfeProc>";
        }
    }
}
