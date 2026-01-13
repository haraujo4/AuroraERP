using Aurora.Domain.Entities.Finance;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aurora.Infrastructure.Persistence.Configurations.Finance
{
    public class InvoiceConfiguration : IEntityTypeConfiguration<Invoice>
    {
        public void Configure(EntityTypeBuilder<Invoice> builder)
        {
            builder.HasKey(x => x.Id);
            
            builder.Property(x => x.Type).IsRequired().HasConversion<string>();
            builder.Property(x => x.Status).IsRequired().HasConversion<string>();
            builder.Property(x => x.GrossAmount).HasPrecision(18, 4);
            builder.Property(x => x.TaxAmount).HasPrecision(18, 4);
            builder.Property(x => x.NetAmount).HasPrecision(18, 4);

            builder.HasOne(x => x.BusinessPartner)
                .WithMany()
                .HasForeignKey(x => x.BusinessPartnerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(x => x.Items)
                .WithOne(x => x.Invoice)
                .HasForeignKey(x => x.InvoiceId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }

    public class InvoiceItemConfiguration : IEntityTypeConfiguration<InvoiceItem>
    {
        public void Configure(EntityTypeBuilder<InvoiceItem> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Description).IsRequired().HasMaxLength(200);
            builder.Property(x => x.Quantity).HasPrecision(18, 4);
            builder.Property(x => x.UnitPrice).HasPrecision(18, 4);
            builder.Property(x => x.TaxAmount).HasPrecision(18, 4);
            builder.Property(x => x.TotalAmount).HasPrecision(18, 4);
        }
    }
}
