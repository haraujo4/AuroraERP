using Aurora.Domain.Entities.Logistics;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aurora.Infrastructure.Persistence.Configurations.Logistics
{
    public class StockLevelConfiguration : IEntityTypeConfiguration<StockLevel>
    {
        public void Configure(EntityTypeBuilder<StockLevel> builder)
        {
            builder.ToTable("StockLevels", "logistics");

            builder.HasKey(x => x.Id);

            builder.Property(e => e.Quantity).HasPrecision(18, 4);
            builder.Property(e => e.BatchNumber).HasMaxLength(50);

            builder.HasOne(x => x.Material)
                   .WithMany()
                   .HasForeignKey(x => x.MaterialId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Deposito)
                   .WithMany()
                   .HasForeignKey(x => x.DepositoId)
                   .OnDelete(DeleteBehavior.Restrict);

            // Ensure unique stock level per material + warehouse + batch
            // If batch is null, it treats it as "no batch"
            // Note: SQL Server unique index treats multiple NULLs as duplicates if not filtered.
            // For simplicity, we can just index them, or use fluent API to adding unique constraint if needed.
            // Let's just index for performance for now.
            builder.HasIndex(x => new { x.MaterialId, x.DepositoId, x.BatchNumber });
        }
    }
}
