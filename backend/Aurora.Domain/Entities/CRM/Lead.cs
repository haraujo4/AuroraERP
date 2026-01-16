using System;
using Aurora.Domain.Common;

namespace Aurora.Domain.Entities.CRM
{
    public enum LeadStatus
    {
        New,
        Contacted,
        Qualified,
        Lost,
        Converted
    }

    public class Lead : BaseEntity
    {
        public string Title { get; private set; }
        public string Source { get; private set; } // e.g., Website, Referral
        public string ContactName { get; private set; }
        public string Email { get; private set; }
        public string? Phone { get; private set; }
        public string CompanyName { get; private set; }
        public LeadStatus Status { get; private set; }
        public decimal? EstimatedValue { get; private set; }
        public string? Notes { get; private set; }
        public bool IsCustomer { get; private set; }

        private readonly List<LeadInteraction> _interactions = new();
        public IReadOnlyCollection<LeadInteraction> Interactions => _interactions.AsReadOnly();

        private Lead() { }

        public Lead(string title, string source, string contactName, string email, string companyName)
        {
            Title = title;
            Source = source;
            ContactName = contactName;
            Email = email;
            CompanyName = companyName;
            Status = LeadStatus.New;
            IsCustomer = false;
        }

        public void UpdateStatus(LeadStatus status)
        {
            Status = status;
            if (status == LeadStatus.Converted)
            {
                IsCustomer = true;
            }
        }

        public void ConvertToCustomer()
        {
            Status = LeadStatus.Converted;
            IsCustomer = true;
        }

        public void AddInteraction(LeadInteraction interaction)
        {
            _interactions.Add(interaction);
        }

        public void SetEstimatedValue(decimal value)
        {
            EstimatedValue = value;
        }

        public void AddNotes(string notes)
        {
            Notes = notes;
        }
    }
}
