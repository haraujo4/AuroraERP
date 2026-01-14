using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Fiscal;
using Aurora.Domain.Entities.Fiscal;
using Aurora.Domain.Entities.Finance;
using Aurora.Domain.Entities.BusinessPartners;
using Aurora.Infrastructure.Integrations.NuvemFiscal;
using Microsoft.Extensions.Configuration;
using System.Linq;

namespace Aurora.Infrastructure.Integrations.NuvemFiscal
{
    public class NuvemFiscalProvider : IFiscalProvider
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private string _accessToken;

        public NuvemFiscalProvider(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
        }

        private async Task AuthenticateAsync()
        {
            // For Nuvem Fiscal, often API Key is passed in header or used to exchange for token.
            // Documentation implies "Authorization: Bearer <API_KEY>" or OAuth.
            // Doc 18.2 says: "Authorization: Bearer <API_KEY>". So we just set it.
            
            var apiKey = _configuration["NuvemFiscal:ApiKey"];
            if (string.IsNullOrEmpty(apiKey)) throw new Exception("Nuvem Fiscal API Key not configured.");
            
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
        }

        public async Task<string> EmitirNfeAsync(FiscalDocument document, Invoice invoice, Aurora.Domain.Entities.BusinessPartners.BusinessPartner bp)
        {
            await AuthenticateAsync();

            var baseUrl = _configuration["NuvemFiscal:BaseUrl"] ?? "https://api.nuvemfiscal.com.br/v2";
            var endpoint = $"{baseUrl}/nfe/emitir";

            // Mapping Logic (Moved from Service)
             var payload = new NuvemFiscalEmitNfeRequest
            {
                referencia = invoice.Number,
                ambiente = 2, // 2=Homologation
                infNFe = new 
                {
                    dest = new { 
                        CPF = bp?.CpfCnpj.Length == 11 ? bp.CpfCnpj : null, 
                        CNPJ = bp?.CpfCnpj.Length > 11 ? bp.CpfCnpj : null, 
                        xNome = bp?.RazaoSocial 
                    },
                    total = new { ICMSTot = new { vNF = invoice.GrossAmount } },
                    det = invoice.Items.Select((item, index) => new 
                    {
                        nItem = index + 1,
                        prod = new { cProd = item.MaterialId, xProd = item.Description, qCom = item.Quantity, vUnCom = item.UnitPrice }
                    }).ToList()
                }
            };

            var response = await _httpClient.PostAsJsonAsync(endpoint, payload);
            
            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new Exception($"Nuvem Fiscal Emission Error: {response.StatusCode} - {error}");
            }

            var result = await response.Content.ReadFromJsonAsync<NuvemFiscalEmitNfeResponse>();
            return result?.id ?? throw new Exception("Failed to retrieve ID from response");
        }

        public async Task<FiscalDocumentStatusResponse> ConsultarNfeAsync(string providerReference)
        {
            await AuthenticateAsync();

            var baseUrl = _configuration["NuvemFiscal:BaseUrl"] ?? "https://api.nuvemfiscal.com.br/v2";
            var endpoint = $"{baseUrl}/nfe/{providerReference}"; // Check API docs for exact path

            var response = await _httpClient.GetAsync(endpoint);
             if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new Exception($"Nuvem Fiscal Consultation Error: {response.StatusCode} - {error}");
            }

            var result = await response.Content.ReadFromJsonAsync<NuvemFiscalConsultNfeResponse>();
            
            var statusResponse = new FiscalDocumentStatusResponse
            {
                Protocol = result?.numero_protocolo,
                XmlUrl = result?.link_xml,
                PdfUrl = result?.link_danfe,
                Message = result?.motivo_status
            };

            // Map Status
            if (result?.status?.ToLower() == "autorizado") statusResponse.Status = "Authorized";
            else if (result?.status?.ToLower() == "rejeitado") statusResponse.Status = "Rejected";
            else if (result?.status?.ToLower() == "erro") statusResponse.Status = "Error";
            else statusResponse.Status = "Processing";

            return statusResponse;
        }
        public async Task<byte[]> GetPdfBytesAsync(string providerReference, Invoice? invoice = null)
        {
            var status = await ConsultarNfeAsync(providerReference);
            if (string.IsNullOrEmpty(status.PdfUrl)) throw new Exception("PDF URL not available.");
            return await _httpClient.GetByteArrayAsync(status.PdfUrl);
        }

        public async Task<string> GetXmlContentAsync(string providerReference, Invoice? invoice = null)
        {
            var status = await ConsultarNfeAsync(providerReference);
            if (string.IsNullOrEmpty(status.XmlUrl)) throw new Exception("XML URL not available.");
            return await _httpClient.GetStringAsync(status.XmlUrl);
        }

        public async Task CancelarNfeAsync(FiscalDocument document, string reason)
        {
            await AuthenticateAsync();

            var baseUrl = _configuration["NuvemFiscal:BaseUrl"] ?? "https://api.nuvemfiscal.com.br/v2";
            var endpoint = $"{baseUrl}/nfe/{document.ProviderReference}/cancelar";

            var payload = new { justificativa = reason };
            
            var response = await _httpClient.PostAsJsonAsync(endpoint, payload);
             if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new Exception($"Nuvem Fiscal Cancellation Error: {response.StatusCode} - {error}");
            }
        }
    }
}
