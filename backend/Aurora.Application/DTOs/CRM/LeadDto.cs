using System;

namespace Aurora.Application.DTOs.CRM
{
    public class LeadDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Source { get; set; }
        public string ContactName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string CompanyName { get; set; }
        public string Status { get; set; }
        public decimal? EstimatedValue { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateLeadDto
    {
        public string Title { get; set; }
        public string Source { get; set; }
        public string ContactName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string CompanyName { get; set; }
        public decimal? EstimatedValue { get; set; }
        public string? Notes { get; set; }
    }
}
