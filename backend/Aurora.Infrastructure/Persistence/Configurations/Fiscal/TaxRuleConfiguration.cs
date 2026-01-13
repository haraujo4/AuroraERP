using Aurora.Domain.Entities.Fiscal;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aurora.Infrastructure.Persistence.Configurations.Fiscal
{
    public class TaxRuleConfiguration : IEntityTypeConfiguration<TaxRule>
    {
        public void Configure(EntityTypeBuilder<TaxRule> builder)
        {
            builder.ToTable("Fiscal_TaxRules");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.SourceState)
                .IsRequired()
                .HasMaxLength(2); // UF

            builder.Property(x => x.DestState)
                .IsRequired()
                .HasMaxLength(2); // UF

            builder.Property(x => x.NcmCode)
                .HasMaxLength(20);

            builder.Property(x => x.IcmsRate)
                .HasPrecision(18, 4);

            builder.Property(x => x.IpiRate)
                .HasPrecision(18, 4);

            builder.Property(x => x.PisRate)
                .HasPrecision(18, 4);

            builder.Property(x => x.CofinsRate)
                .HasPrecision(18, 4);
        }
    }
}
