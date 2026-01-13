using Aurora.Domain.Entities.Production;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aurora.Infrastructure.Persistence.Configurations.Production
{
    public class WorkCenterConfiguration : IEntityTypeConfiguration<WorkCenter>
    {
        public void Configure(EntityTypeBuilder<WorkCenter> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Name).IsRequired().HasMaxLength(100);
            builder.Property(x => x.Code).IsRequired().HasMaxLength(20);
            
            // Optional CostCenter link, restricted delete to avoid issues if CC is deleted
            // Assuming CostCenter entity exists but we might not have a nav property back to it in this bounded context yet
            // If we do, we can configure it.
        }
    }

    public class BillOfMaterialConfiguration : IEntityTypeConfiguration<BillOfMaterial>
    {
        public void Configure(EntityTypeBuilder<BillOfMaterial> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Description).HasMaxLength(200);
            builder.Property(x => x.BaseQuantity).HasPrecision(18, 4);

            builder.HasOne(x => x.Product)
                .WithMany()
                .HasForeignKey(x => x.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(x => x.Items)
                .WithOne(x => x.BillOfMaterial)
                .HasForeignKey(x => x.BillOfMaterialId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }

    public class BillOfMaterialItemConfiguration : IEntityTypeConfiguration<BillOfMaterialItem>
    {
        public void Configure(EntityTypeBuilder<BillOfMaterialItem> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Quantity).HasPrecision(18, 4);

            builder.HasOne(x => x.Component)
                .WithMany()
                .HasForeignKey(x => x.ComponentId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }

    public class ProductionOrderConfiguration : IEntityTypeConfiguration<ProductionOrder>
    {
        public void Configure(EntityTypeBuilder<ProductionOrder> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.OrderNumber).IsRequired().HasMaxLength(50);
            builder.Property(x => x.Quantity).HasPrecision(18, 4);
            builder.Property(x => x.Status).IsRequired().HasConversion<string>();

            builder.HasOne(x => x.Product)
                .WithMany()
                .HasForeignKey(x => x.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.WorkCenter)
                .WithMany()
                .HasForeignKey(x => x.WorkCenterId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
