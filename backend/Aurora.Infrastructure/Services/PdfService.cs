using Aurora.Application.DTOs.Sales;
using Aurora.Application.Interfaces.Services;
using Aurora.Domain.Entities.Organization;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System;
using System.Linq;

namespace Aurora.Infrastructure.Services
{
    public class PdfService : IPdfService
    {
        public PdfService()
        {
            // License configuration - check if free license is applicable for the user
            QuestPDF.Settings.License = LicenseType.Community;
        }

        public byte[] GenerateSalesQuotePdf(SalesQuoteDto quote, Empresa company)
        {
            return Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, Unit.Centimetre);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(11).FontFamily(Fonts.Arial));

                    page.Header().Element(header => ComposeHeader(header, company));
                    page.Content().Element(content => ComposeContent(content, quote));
                    page.Footer().AlignCenter().Text(x =>
                    {
                        x.CurrentPageNumber();
                        x.Span(" / ");
                        x.TotalPages();
                    });
                });
            }).GeneratePdf();
        }

        void ComposeHeader(IContainer container, Empresa company)
        {
            var titleStyle = TextStyle.Default.FontSize(20).SemiBold().FontColor(Colors.Blue.Darken2);

            container.Row(row =>
            {
                row.RelativeItem().Column(column =>
                {
                    column.Item().Text($"{company?.RazaoSocial ?? "NOME DA EMPRESA"}").Style(titleStyle);
                    
                    column.Item().Text(text =>
                    {
                        text.Span("Endereço: ").SemiBold();
                        text.Span($"{company?.EnderecoFiscal?.Street ?? "Rua Exemplo"}, {company?.EnderecoFiscal?.Number ?? "000"} - {company?.EnderecoFiscal?.Neighborhood ?? "Centro"}");
                    });
                    
                    column.Item().Text(text =>
                    {
                        text.Span("CNPJ: ").SemiBold();
                        text.Span($"{company?.CNPJ ?? "00.000.000/0001-00"}");
                        // Removed Email as it's not in the entity
                    });
                });
            });
        }

        void ComposeContent(IContainer container, SalesQuoteDto quote)
        {
            container.PaddingVertical(40).Column(column =>
            {
                column.Spacing(20);

                // Title
                column.Item().AlignCenter().Text("Orçamento de Venda").FontSize(18).SemiBold().Underline();

                // Client Info
                column.Item().Border(1).BorderColor(Colors.Grey.Lighten2).Padding(10).Column(c => 
                {
                    c.Item().Text(text => { text.Span("Cliente: ").SemiBold(); text.Span(quote.BusinessPartnerName); });
                    c.Item().Text(text => { text.Span("Data do Orçamento: ").SemiBold(); text.Span(quote.QuoteDate.ToShortDateString()); });
                    c.Item().Text(text => { text.Span("Número: ").SemiBold(); text.Span(quote.Number); });
                });

                // Items Table
                column.Item().Table(table =>
                {
                    table.ColumnsDefinition(columns =>
                    {
                        columns.ConstantColumn(30);
                        columns.RelativeColumn(3);
                        columns.RelativeColumn();
                        columns.RelativeColumn();
                        columns.RelativeColumn();
                    });

                    table.Header(header =>
                    {
                        header.Cell().Element(CellStyle).Text("#");
                        header.Cell().Element(CellStyle).Text("Item");
                        header.Cell().Element(CellStyle).AlignRight().Text("Qtd");
                        header.Cell().Element(CellStyle).AlignRight().Text("Vl. Unit");
                        header.Cell().Element(CellStyle).AlignRight().Text("Total");

                        static IContainer CellStyle(IContainer container)
                        {
                            return container.DefaultTextStyle(x => x.SemiBold()).PaddingVertical(5).BorderBottom(1).BorderColor(Colors.Black);
                        }
                    });

                    foreach (var item in quote.Items)
                    {
                        table.Cell().Element(CellStyle).Text("•");
                        table.Cell().Element(CellStyle).Text(item.MaterialName);
                        table.Cell().Element(CellStyle).AlignRight().Text($"{item.Quantity}");
                        table.Cell().Element(CellStyle).AlignRight().Text($"{item.UnitPrice:C}");
                        table.Cell().Element(CellStyle).AlignRight().Text($"{item.TotalValue:C}");

                        static IContainer CellStyle(IContainer container)
                        {
                            return container.BorderBottom(1).BorderColor(Colors.Grey.Lighten2).PaddingVertical(5);
                        }
                    }
                });

                // Totals
                column.Item().AlignRight().Column(c =>
                {
                    c.Item().Text($"Total Geral: {quote.TotalValue:C}").FontSize(14).SemiBold();
                });
                
                // Observations
                column.Item().PaddingTop(20).Background(Colors.Grey.Lighten4).Padding(10).Column(c =>
                {
                    c.Item().Text("Observações:").SemiBold();
                    c.Item().Text("Este orçamento é válido por 15 dias.");
                });
            });
        }
    }
}
