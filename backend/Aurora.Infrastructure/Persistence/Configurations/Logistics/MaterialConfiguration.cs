using Aurora.Domain.Entities.Logistics;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aurora.Infrastructure.Persistence.Configurations.Logistics
{
    public class MaterialConfiguration : IEntityTypeConfiguration<Material>
    {
        public void Configure(EntityTypeBuilder<Material> builder)
        {
            builder.ToTable("Materials", "logistics");

            builder.HasKey(x => x.Id);

            builder.Property(e => e.Code).IsRequired().HasMaxLength(50);
            builder.Property(e => e.Description).IsRequired().HasMaxLength(200);
            builder.Property(e => e.Type).IsRequired().HasMaxLength(50);
            builder.Property(e => e.Group).HasMaxLength(50);
            builder.Property(e => e.UnitOfMeasure).IsRequired().HasMaxLength(10);
            
            // Logistics
            builder.Property(e => e.WeightUnit).HasMaxLength(10);
            builder.Property(e => e.DimensionUnit).HasMaxLength(10);
            builder.Property(e => e.NetWeight).HasPrecision(18, 4);
            builder.Property(e => e.GrossWeight).HasPrecision(18, 4);
            builder.Property(e => e.Width).HasPrecision(18, 4);
            builder.Property(e => e.Height).HasPrecision(18, 4);
            builder.Property(e => e.Length).HasPrecision(18, 4);
            builder.Property(e => e.MinStock).HasPrecision(18, 4);
            builder.Property(e => e.MaxStock).HasPrecision(18, 4);

            // Sales & Purchasing
            builder.Property(e => e.BasePrice).HasPrecision(18, 2);
            builder.Property(e => e.StandardCost).HasPrecision(18, 2);
            builder.Property(e => e.SalesUnit).HasMaxLength(10);
            builder.Property(e => e.PurchasingUnit).HasMaxLength(10);
            builder.Property(e => e.TaxClassification).HasMaxLength(20);

            // Indexes
            builder.HasIndex(e => e.Code).IsUnique();
        }
    }
}
