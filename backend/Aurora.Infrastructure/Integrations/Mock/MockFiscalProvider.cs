using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Aurora.Application.Interfaces.Fiscal;
using Aurora.Domain.Entities.Fiscal;
using Aurora.Domain.Entities.Finance;
using Aurora.Domain.Entities.BusinessPartners;
using Aurora.Domain.Enums;
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
            
            var pdfBytes = GeneratePdf(invoice, bp, company);
            _cache.Set($"pdf_{providerRef}", pdfBytes, TimeSpan.FromHours(1));

            var xmlContent = GenerateXml(invoice, bp, company);
            _cache.Set($"xml_{providerRef}", xmlContent, TimeSpan.FromHours(1));

            return providerRef;
        }

        public Task<FiscalDocumentStatusResponse> ConsultarNfeAsync(string providerReference)
        {
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
            return Task.CompletedTask;
        }

        private byte[] GeneratePdf(Invoice invoice, BusinessPartner bp, Aurora.Domain.Entities.Organization.Empresa company)
        {
            // Determine Service vs Product based on item description content for now
            var isService = invoice.Items.Any(i => i.Description.Contains("Serviço") || i.Description.Contains("Consultoria"));
            // Fallback to Inbound invoice meaning we received a service? Or Outbound (we provided service). 
            // In typical billing, we bill Outbound. 
            // If Inbound, it's a "Nota de Entrada".
            // Let's assume layout works for both, just Title changes.

            var title = isService ? "NOTA FISCAL DE SERVIÇO" : "NOTA FISCAL DE PRODUTO";
            var number = invoice.Number.PadLeft(9, '0');
            var issueDate = invoice.IssueDate.ToString("dd/MM/yyyy");

            return Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(1, Unit.Centimetre);
                    page.DefaultTextStyle(x => x.FontSize(9).FontFamily(Fonts.Arial));

                    page.Background().Element(watermark => 
                    {
                         watermark.TranslateX(50).TranslateY(300).Rotate(-45).Text("SEM VALOR FISCAL")
                            .FontSize(80).FontColor(Colors.Grey.Lighten3).Bold();
                    });

                    page.Header().Column(col => 
                    {
                         col.Item().Border(1).BorderColor(Colors.Black).Padding(10).Row(row => 
                         {
                            row.RelativeItem().Column(c => 
                            {
                                c.Item().Text(company?.RazaoSocial?.ToUpper() ?? "SOFTLAB SOLUÇÕES DIGITAIS").FontSize(14).Bold().AlignCenter();
                                c.Item().Text($"{title} - N° {number}").FontSize(10).Bold().AlignCenter();
                                c.Item().Text($"DATA DE EMISSÃO: {issueDate}").FontSize(10).Bold().AlignCenter();
                            });
                         });
                    });

                    page.Content().PaddingTop(10).Column(col => 
                    {
                        // Section 1: Provider / Issuer
                        col.Item().Border(1).BorderColor(Colors.Black).Padding(5).Column(c =>
                        {
                            var roleTitle = isService ? "PRESTADOR DE SERVIÇOS" : "EMITENTE";
                            c.Item().Text(roleTitle).Bold().FontSize(8);
                            c.Item().Text($"RAZÃO SOCIAL: {company?.RazaoSocial}").FontSize(9);
                            c.Item().Text($"CNPJ: {company?.CNPJ}").FontSize(9);
                            c.Item().Text($"INSCRIÇÃO MUNICIPAL: {company?.InscricaoMunicipal ?? "N/A"}").FontSize(9); // Fixed Property
                            c.Item().Text($"ENDEREÇO: {FormatAddress(company?.EnderecoFiscal)}").FontSize(9);
                        });

                        col.Item().Height(10);

                        // Section 2: Receiver / Taker
                        col.Item().Border(1).BorderColor(Colors.Black).Padding(5).Column(c =>
                        {
                            var roleTitle = isService ? "TOMADOR DE SERVIÇOS" : "DESTINATÁRIO / REMETENTE";
                            c.Item().Text(roleTitle).Bold().FontSize(8);
                            c.Item().Text($"RAZÃO SOCIAL: {bp?.RazaoSocial}").FontSize(9);
                            c.Item().Text($"CNPJ/CPF: {bp?.CpfCnpj}").FontSize(9);
                            if (!isService) c.Item().Text($"INSCRIÇÃO ESTADUAL: {bp?.RgIe ?? "ISENTO"}").FontSize(9); // Fixed Property
                            
                            var address = bp?.Addresses?.FirstOrDefault()?.Address;
                            c.Item().Text($"ENDEREÇO: {FormatAddress(address)}").FontSize(9);
                        });

                        col.Item().Height(10);

                        // Items Table
                        col.Item().Border(1).BorderColor(Colors.Black).Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.ConstantColumn(30); // Item
                                columns.RelativeColumn();   // Descricao
                                columns.ConstantColumn(50); // Qty
                                columns.ConstantColumn(50); // Unit
                                columns.ConstantColumn(70); // Unit Price
                                columns.ConstantColumn(70); // Total Price
                                if (!isService)
                                {
                                    columns.ConstantColumn(40); // ICMS
                                    columns.ConstantColumn(40); // IPI
                                }
                            });

                            table.Header(header =>
                            {
                                header.Cell().BorderBottom(1).Padding(2).Text("ITEM").Bold().FontSize(8).AlignCenter();
                                header.Cell().BorderBottom(1).Padding(2).Text(isService ? "DESCRIÇÃO DO SERVIÇO" : "DESCRIÇÃO DO PRODUTO").Bold().FontSize(8);
                                header.Cell().BorderBottom(1).Padding(2).Text(isService ? "QTD" : "QUANT").Bold().FontSize(8).AlignCenter();
                                header.Cell().BorderBottom(1).Padding(2).Text("UNID").Bold().FontSize(8).AlignCenter();
                                header.Cell().BorderBottom(1).Padding(2).Text("VALOR UNIT").Bold().FontSize(8).AlignCenter();
                                header.Cell().BorderBottom(1).Padding(2).Text("TOTAL").Bold().FontSize(8).AlignCenter();
                                if(!isService)
                                {
                                    header.Cell().BorderBottom(1).Padding(2).Text("ICMS").Bold().FontSize(8).AlignCenter();
                                    header.Cell().BorderBottom(1).Padding(2).Text("IPI").Bold().FontSize(8).AlignCenter();
                                }
                            });

                            int index = 1;
                            foreach(var item in invoice.Items)
                            {
                                table.Cell().BorderBottom(1).Padding(2).Text(index.ToString()).FontSize(8).AlignCenter();
                                table.Cell().BorderBottom(1).Padding(2).Text(item.Description).FontSize(8);
                                table.Cell().BorderBottom(1).Padding(2).Text(item.Quantity.ToString("F0")).FontSize(8).AlignCenter();
                                table.Cell().BorderBottom(1).Padding(2).Text("UN").FontSize(8).AlignCenter();
                                table.Cell().BorderBottom(1).Padding(2).Text(item.UnitPrice.ToString("N2")).FontSize(8).AlignRight();
                                table.Cell().BorderBottom(1).Padding(2).Text(item.TotalAmount.ToString("N2")).FontSize(8).AlignRight();
                                
                                if (!isService)
                                {
                                    table.Cell().BorderBottom(1).Padding(2).Text("18%").FontSize(8).AlignCenter();
                                    table.Cell().BorderBottom(1).Padding(2).Text("5%").FontSize(8).AlignCenter();
                                }
                                index++;
                            }

                            // Fill Empty Rows
                            for(int i = 0; i < 5 - invoice.Items.Count; i++)
                            {
                                table.Cell().BorderBottom(1).Padding(5).Text("");
                                table.Cell().BorderBottom(1).Padding(5).Text("");
                                table.Cell().BorderBottom(1).Padding(5).Text("");
                                table.Cell().BorderBottom(1).Padding(5).Text("");
                                table.Cell().BorderBottom(1).Padding(5).Text("");
                                table.Cell().BorderBottom(1).Padding(5).Text("");
                                if (!isService)
                                {
                                    table.Cell().BorderBottom(1).Padding(5).Text("");
                                    table.Cell().BorderBottom(1).Padding(5).Text("");
                                }
                            }
                        });
                        
                        // Totals
                        col.Item().PaddingTop(2).Column(c => 
                        {
                            if (isService)
                            {
                                c.Item().PaddingTop(5).Text($"VALOR TOTAL DOS SERVIÇOS: R$ {invoice.GrossAmount:N2}").Bold().FontSize(9);
                                c.Item().Text($"ISS (5%): R$ {(invoice.GrossAmount * 0.05m):N2}").Bold().FontSize(9);
                            }
                            else
                            {
                                c.Item().PaddingTop(5).Text($"VALOR TOTAL DOS PRODUTOS: R$ {invoice.GrossAmount:N2}").Bold().FontSize(9);
                                c.Item().Text($"VALOR TOTAL DA NOTA: R$ {invoice.GrossAmount + invoice.TaxAmount:N2}").Bold().FontSize(9);
                            }
                        });

                        col.Item().Height(10);

                        // Footer / Notes
                        col.Item().Border(1).BorderColor(Colors.Black).Padding(5).Column(c => 
                        {
                            c.Item().Text("TRANSPORTADORA: JADLOG").FontSize(9); // Mock
                            // removed invoice.Notes call
                             c.Item().Text("OBSERVAÇÕES: Sem observações adicionais.").FontSize(9);
                        });

                    });
                });
            })
            .GeneratePdf();
        }

        private string FormatAddress(Domain.ValueObjects.Address? addr)
        {
            if (addr == null) return "Endereço não informado";
            return $"{addr.Street}, {addr.Number} - {addr.Neighborhood} - {addr.City}/{addr.State} - CEP: {addr.ZipCode}";
        }

        private string GenerateXml(Invoice invoice, BusinessPartner bp, Aurora.Domain.Entities.Organization.Empresa company)
        {
             return $@"<?xml version=""1.0"" encoding=""UTF-8""?>
<nfeProc versao=""4.00"" xmlns=""http://www.portalfiscal.inf.br/nfe"">
    <NFe>
         <infNFe Id=""NFe{new Random().Next(1000,9999)}"">
            <emit><xNome>{company?.RazaoSocial}</xNome></emit>
            <dest><xNome>{bp?.RazaoSocial}</xNome></dest>
            <total><ICMSTot><vNF>{invoice.GrossAmount}</vNF></ICMSTot></total>
        </infNFe>
    </NFe>
</nfeProc>";
        }
    }
}
