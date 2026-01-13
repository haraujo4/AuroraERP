using Aurora.Domain.Entities.Purchasing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aurora.Infrastructure.Persistence.Configurations.Purchasing
{
    public class PurchaseRequisitionConfiguration : IEntityTypeConfiguration<PurchaseRequisition>
    {
        public void Configure(EntityTypeBuilder<PurchaseRequisition> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.RequisitionNumber).IsRequired().HasMaxLength(50);
            builder.Property(x => x.Requester).HasMaxLength(100);
            builder.Property(x => x.Status).IsRequired().HasConversion<int>();
            builder.Property(x => x.Notes).HasMaxLength(500);

            builder.HasMany(x => x.Items)
                .WithOne(x => x.Requisition)
                .HasForeignKey(x => x.RequisitionId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }

    public class PurchaseRequisitionItemConfiguration : IEntityTypeConfiguration<PurchaseRequisitionItem>
    {
        public void Configure(EntityTypeBuilder<PurchaseRequisitionItem> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Quantity).HasPrecision(18, 4);

            builder.HasOne(x => x.Material)
                .WithMany()
                .HasForeignKey(x => x.MaterialId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.CostCenter)
                .WithMany()
                .HasForeignKey(x => x.CostCenterId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }

    public class PurchaseOrderConfiguration : IEntityTypeConfiguration<PurchaseOrder>
    {
        public void Configure(EntityTypeBuilder<PurchaseOrder> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.OrderNumber).IsRequired().HasMaxLength(50);
            builder.Property(x => x.TotalAmount).HasPrecision(18, 4);
            builder.Property(x => x.Status).IsRequired().HasConversion<int>();
            builder.Property(x => x.Type).IsRequired().HasConversion<int>();
            builder.Property(x => x.Notes).HasMaxLength(500);

            builder.HasOne(x => x.Supplier)
                .WithMany()
                .HasForeignKey(x => x.SupplierId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(x => x.Items)
                .WithOne(x => x.Order)
                .HasForeignKey(x => x.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }

    public class PurchaseOrderItemConfiguration : IEntityTypeConfiguration<PurchaseOrderItem>
    {
        public void Configure(EntityTypeBuilder<PurchaseOrderItem> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Quantity).HasPrecision(18, 4);
            builder.Property(x => x.UnitPrice).HasPrecision(18, 4);
            builder.Property(x => x.TotalAmount).HasPrecision(18, 4);
            builder.Property(x => x.ReceivedQuantity).HasPrecision(18, 4);

            builder.HasOne(x => x.Material)
                .WithMany()
                .HasForeignKey(x => x.MaterialId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
