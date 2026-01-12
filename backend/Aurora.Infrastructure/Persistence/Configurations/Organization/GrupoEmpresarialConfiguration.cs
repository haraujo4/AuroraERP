using Aurora.Domain.Entities.Organization;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aurora.Infrastructure.Persistence.Configurations.Organization
{
    public class GrupoEmpresarialConfiguration : IEntityTypeConfiguration<GrupoEmpresarial>
    {
        public void Configure(EntityTypeBuilder<GrupoEmpresarial> builder)
        {
            builder.ToTable("GruposEmpresariais", "organization");
            
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Codigo).HasMaxLength(10).IsRequired();
            builder.Property(x => x.RazaoSocialConsolidada).HasMaxLength(100).IsRequired();
            builder.Property(x => x.NomeFantasia).HasMaxLength(100).IsRequired();
            builder.Property(x => x.PaisConsolidacao).HasMaxLength(50).IsRequired();
            builder.Property(x => x.MoedaBase).HasMaxLength(3).IsRequired(); // ISO
            builder.Property(x => x.IdiomaPadrao).HasMaxLength(5).IsRequired(); // pt-BR
            builder.Property(x => x.RegimeFiscalConsolidado).HasMaxLength(50).IsRequired();
        }
    }
}
