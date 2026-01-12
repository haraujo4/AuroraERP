using System;
using Aurora.Domain.Common;
using Aurora.Domain.Entities.BusinessPartners;

namespace Aurora.Domain.Entities.CRM
{
    public enum OpportunityStage
    {
        Prospecting,
        Qualification,
        Proposal,
        Negotiation,
        ClosedWon,
        ClosedLost
    }

    public class Opportunity : BaseEntity
    {
        public string Title { get; private set; }
        public Guid? BusinessPartnerId { get; private set; }
        public BusinessPartner? BusinessPartner { get; private set; }
        public Guid? LeadId { get; private set; }
        public Lead? Lead { get; private set; }
        
        public decimal EstimatedValue { get; private set; }
        public DateTime CloseDate { get; private set; }
        public int Probability { get; private set; } // 0-100%
        public OpportunityStage Stage { get; private set; }
        
        private Opportunity() { }

        public Opportunity(string title, Guid? businessPartnerId, Guid? leadId, decimal estimatedValue, DateTime closeDate)
        {
            if (businessPartnerId == null && leadId == null)
                throw new ArgumentException("Opportunity must be linked to a Business Partner or a Lead.");

            Title = title;
            BusinessPartnerId = businessPartnerId;
            LeadId = leadId;
            EstimatedValue = estimatedValue;
            CloseDate = closeDate;
            Stage = OpportunityStage.Prospecting;
            Probability = 10;
        }

        public void ChangeStage(OpportunityStage stage, int probability)
        {
            Stage = stage;
            Probability = probability;
        }
    }
}
