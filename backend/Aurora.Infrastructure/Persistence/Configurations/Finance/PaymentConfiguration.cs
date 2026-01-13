using Aurora.Domain.Entities.Finance;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aurora.Infrastructure.Persistence.Configurations.Finance
{
    public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
    {
        public void Configure(EntityTypeBuilder<Payment> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Amount).IsRequired().HasPrecision(18, 4);
            builder.Property(x => x.Method).IsRequired().HasConversion<string>();

            builder.HasOne(x => x.BusinessPartner)
                .WithMany()
                .HasForeignKey(x => x.BusinessPartnerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Invoice)
                .WithMany() // Assuming Invoice does not have a collection of Payments for now
                .HasForeignKey(x => x.InvoiceId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
