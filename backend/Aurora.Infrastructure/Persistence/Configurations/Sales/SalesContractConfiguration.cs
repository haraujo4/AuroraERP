using Aurora.Domain.Entities.Sales;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aurora.Infrastructure.Persistence.Configurations.Sales
{
    public class SalesContractConfiguration : IEntityTypeConfiguration<SalesContract>
    {
        public void Configure(EntityTypeBuilder<SalesContract> builder)
        {
            builder.ToTable("SalesContracts", "sales");

            builder.HasKey(e => e.Id);

            builder.Property(e => e.ContractNumber)
                .IsRequired()
                .HasMaxLength(50);
            
            builder.Property(e => e.Status)
                .HasMaxLength(20);

            builder.Property(e => e.BillingFrequency)
                .HasMaxLength(20);
                
            builder.Property(e => e.TotalMonthlyValue)
                .HasPrecision(18, 2);

            builder.HasOne(e => e.BusinessPartner)
                .WithMany()
                .HasForeignKey(e => e.BusinessPartnerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(e => e.Items)
                .WithOne(e => e.SalesContract)
                .HasForeignKey(e => e.SalesContractId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
