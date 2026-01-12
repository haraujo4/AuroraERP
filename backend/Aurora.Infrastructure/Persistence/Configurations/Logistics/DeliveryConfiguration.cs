using Aurora.Domain.Entities.Logistics;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aurora.Infrastructure.Persistence.Configurations.Logistics
{
    public class DeliveryConfiguration : IEntityTypeConfiguration<Delivery>
    {
        public void Configure(EntityTypeBuilder<Delivery> builder)
        {
            builder.ToTable("Deliveries", "logistics");
            
            builder.HasKey(x => x.Id);
            
            builder.Property(x => x.Number)
                .IsRequired()
                .HasMaxLength(20);

            builder.HasMany(x => x.Items)
                .WithOne()
                .HasForeignKey(x => x.DeliveryId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }

    public class DeliveryItemConfiguration : IEntityTypeConfiguration<DeliveryItem>
    {
        public void Configure(EntityTypeBuilder<DeliveryItem> builder)
        {
            builder.ToTable("DeliveryItems", "logistics");
            
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Quantity)
                .HasPrecision(18, 4);
        }
    }
}
