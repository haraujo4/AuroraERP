using Aurora.Domain.Entities.Sales;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aurora.Infrastructure.Persistence.Configurations.Sales
{
    public class SalesContractItemConfiguration : IEntityTypeConfiguration<SalesContractItem>
    {
        public void Configure(EntityTypeBuilder<SalesContractItem> builder)
        {
            builder.ToTable("SalesContractItems", "sales");

            builder.HasKey(e => e.Id);

            builder.HasOne(e => e.Material)
                .WithMany()
                .HasForeignKey(e => e.MaterialId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(e => e.Quantity)
                .HasPrecision(18, 2);

            builder.Property(e => e.UnitPrice)
                .HasPrecision(18, 2);
                
            builder.Property(e => e.DiscountPercentage)
                .HasPrecision(5, 2);

            builder.Property(e => e.TotalValue)
                .HasPrecision(18, 2);
        }
    }
}
