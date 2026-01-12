using Aurora.Domain.Entities.Logistics;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aurora.Infrastructure.Persistence.Configurations.Logistics
{
    public class StockMovementConfiguration : IEntityTypeConfiguration<StockMovement>
    {
        public void Configure(EntityTypeBuilder<StockMovement> builder)
        {
            builder.ToTable("StockMovements", "logistics");

            builder.HasKey(x => x.Id);

            builder.Property(e => e.Quantity).HasPrecision(18, 4);
            builder.Property(e => e.BatchNumber).HasMaxLength(50);
            builder.Property(e => e.ReferenceDocument).IsRequired().HasMaxLength(100);
            builder.Property(e => e.Type).IsRequired().HasConversion<string>();

            builder.HasOne(x => x.Material)
                   .WithMany()
                   .HasForeignKey(x => x.MaterialId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Deposito)
                   .WithMany()
                   .HasForeignKey(x => x.DepositoId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
