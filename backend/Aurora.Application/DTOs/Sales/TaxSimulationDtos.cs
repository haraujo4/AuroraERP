using System;

namespace Aurora.Application.DTOs.Sales
{
    public class SimulateTaxDto
    {
        public Guid BusinessPartnerId { get; set; }
        public Guid MaterialId { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Quantity { get; set; }
    }

    public class SimulatedTaxResultDto
    {
        public decimal IpiRate { get; set; }
        public decimal IpiValue { get; set; }
        public decimal IcmsRate { get; set; }
        public decimal IcmsValue { get; set; }
        public int Cfop { get; set; }
        public int CstIcms { get; set; }
    }
}
