using Aurora.Domain.Common;
using Aurora.Domain.Entities.BusinessPartners;

namespace Aurora.Domain.Entities.Sales
{
    public class SalesContract : BaseEntity
    {
        public Guid BusinessPartnerId { get; set; }
        public virtual BusinessPartner BusinessPartner { get; set; }

        public string ContractNumber { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int BillingDay { get; set; }
        public string BillingFrequency { get; set; } // Monthly, Quarterly, Annually
        
        public string Status { get; set; } = "Draft"; // Draft, Active, Suspended, Cancelled, Expired
        public decimal TotalMonthlyValue { get; set; }

        public virtual ICollection<SalesContractItem> Items { get; set; } = new List<SalesContractItem>();
    }
}
