using Aurora.Domain.Entities.Sales;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aurora.Infrastructure.Persistence.Configurations.Sales
{
    public class SalesQuoteConfiguration : IEntityTypeConfiguration<SalesQuote>
    {
        public void Configure(EntityTypeBuilder<SalesQuote> builder)
        {
            builder.ToTable("SalesQuotes", "sales");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Number).HasMaxLength(20).IsRequired();
            
            builder.Property(x => x.Status)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired();

            builder.Property(x => x.TotalValue).HasPrecision(18, 2);

            // Items relationship
            builder.OwnsMany(x => x.Items, i =>
            {
                i.ToTable("SalesQuoteItems", "sales");
                i.HasKey(x => x.Id);
                i.WithOwner().HasForeignKey("SalesQuoteId");

                i.Property(x => x.Quantity).HasPrecision(18, 4); // Allow decimal quantities
                i.Property(x => x.UnitPrice).HasPrecision(18, 2);
                i.Property(x => x.DiscountPercentage).HasPrecision(5, 2);
                i.Property(x => x.TotalValue).HasPrecision(18, 2);

                i.HasOne(x => x.Material)
                 .WithMany()
                 .HasForeignKey(x => x.MaterialId);
            });

            // Relationships
            builder.HasOne(x => x.BusinessPartner)
                   .WithMany()
                   .HasForeignKey(x => x.BusinessPartnerId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Opportunity)
                   .WithMany()
                   .HasForeignKey(x => x.OpportunityId)
                   .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
