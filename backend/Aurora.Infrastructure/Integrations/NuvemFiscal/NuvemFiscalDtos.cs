using System;

namespace Aurora.Infrastructure.Integrations.NuvemFiscal
{
    public class NuvemFiscalAuthResponse
    {
        public string access_token { get; set; }
        public string token_type { get; set; }
        public int expires_in { get; set; }
        public string scope { get; set; }
    }

    public class NuvemFiscalEmitNfeRequest
    {
        public string referencia { get; set; } // Your Invoice ID
        public int ambiente { get; set; } = 2; // 1=Production, 2=Homologation
        public object infNFe { get; set; } // Simplified for MVP - Ideally strongly typed NFe structure
    }

    public class NuvemFiscalEmitNfeResponse
    {
        public string id { get; set; }
        public string status { get; set; }
        public string mensagem { get; set; }
        // ... detailed fields
    }

    public class NuvemFiscalConsultNfeResponse
    {
        public string id { get; set; }
        public string status { get; set; } // "autorizado", "rejeitado", "processando"
        public string motivo_status { get; set; }
        public string chave { get; set; }
        public string numero_protocolo { get; set; }
        public string tipo_ambiente { get; set; }
        public string xml_autorizado { get; set; } // URL or Base64
        public string link_danfe { get; set; }
        public string link_xml { get; set; }
    }
}
