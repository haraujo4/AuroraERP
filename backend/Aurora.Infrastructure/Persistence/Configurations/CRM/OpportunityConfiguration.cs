using Aurora.Domain.Entities.CRM;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aurora.Infrastructure.Persistence.Configurations.CRM
{
    public class OpportunityConfiguration : IEntityTypeConfiguration<Opportunity>
    {
        public void Configure(EntityTypeBuilder<Opportunity> builder)
        {
            builder.ToTable("Opportunities", "commercial");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Title).HasMaxLength(150).IsRequired();
            
            builder.Property(x => x.EstimatedValue).HasPrecision(18, 2);
            
            builder.Property(x => x.Stage)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired();

            builder.HasOne(x => x.BusinessPartner)
                .WithMany()
                .HasForeignKey(x => x.BusinessPartnerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Lead)
                .WithMany()
                .HasForeignKey(x => x.LeadId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
