using Aurora.Domain.Entities.CRM;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aurora.Infrastructure.Persistence.Configurations.CRM
{
    public class LeadConfiguration : IEntityTypeConfiguration<Lead>
    {
        public void Configure(EntityTypeBuilder<Lead> builder)
        {
            builder.ToTable("Leads", "commercial");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Title).HasMaxLength(150).IsRequired();
            builder.Property(x => x.Source).HasMaxLength(50).IsRequired();
            builder.Property(x => x.ContactName).HasMaxLength(100).IsRequired();
            builder.Property(x => x.Email).HasMaxLength(100);
            builder.Property(x => x.Phone).HasMaxLength(20).IsRequired(false);
            builder.Property(x => x.CompanyName).HasMaxLength(150);
            
            builder.Property(x => x.Status)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired();

            builder.Property(x => x.EstimatedValue)
                .HasPrecision(18, 2);

            builder.Property(x => x.Notes)
                .HasMaxLength(1000);
        }
    }
}
