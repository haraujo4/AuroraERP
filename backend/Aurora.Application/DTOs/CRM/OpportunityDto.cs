using System;

namespace Aurora.Application.DTOs.CRM
{
    public class OpportunityDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public Guid? BusinessPartnerId { get; set; }
        public string? BusinessPartnerName { get; set; }
        public Guid? LeadId { get; set; }
        public string? LeadName { get; set; }
        public decimal EstimatedValue { get; set; }
        public DateTime CloseDate { get; set; }
        public int Probability { get; set; }
        public string Stage { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateOpportunityDto
    {
        public string Title { get; set; }
        public Guid? BusinessPartnerId { get; set; }
        public Guid? LeadId { get; set; }
        public decimal EstimatedValue { get; set; }
        public DateTime CloseDate { get; set; }
    }
}
