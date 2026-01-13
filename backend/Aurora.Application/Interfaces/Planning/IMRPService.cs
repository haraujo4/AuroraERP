using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Aurora.Application.Interfaces.Planning
{
    public interface IMRPService
    {
        Task<MRPResultDto> RunMRPAsync();
    }

    public class MRPResultDto
    {
        public DateTime ExecutionTime { get; set; }
        public List<MRPRecommendationDto> Recommendations { get; set; } = new();
    }

    public class MRPRecommendationDto
    {
        public Guid MaterialId { get; set; }
        public string MaterialCode { get; set; } = string.Empty;
        public string MaterialDescription { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        public DateTime RequiredDate { get; set; }
        public string ActionType { get; set; } // PurchaseRequisition, ProductionOrder
        public string Reason { get; set; } = string.Empty;
    }
}
