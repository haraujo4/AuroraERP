using Aurora.Domain.Entities.Organization;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aurora.Infrastructure.Persistence.Configurations.Organization
{
    public class CentroCustoConfiguration : IEntityTypeConfiguration<CentroCusto>
    {
        public void Configure(EntityTypeBuilder<CentroCusto> builder)
        {
            builder.ToTable("CentrosCusto", "organization");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Codigo).HasMaxLength(20).IsRequired();
            builder.Property(x => x.Descricao).HasMaxLength(100).IsRequired();
            builder.Property(x => x.Responsavel).HasMaxLength(100);

            builder.HasOne(x => x.Empresa)
                   .WithMany()
                   .HasForeignKey(x => x.EmpresaId);
        }
    }

    public class CentroLucroConfiguration : IEntityTypeConfiguration<CentroLucro>
    {
        public void Configure(EntityTypeBuilder<CentroLucro> builder)
        {
            builder.ToTable("CentrosLucro", "organization");
            builder.HasKey(x => x.Id);
             builder.Property(x => x.Codigo).HasMaxLength(20).IsRequired();
            builder.Property(x => x.Descricao).HasMaxLength(100).IsRequired();
            builder.Property(x => x.Responsavel).HasMaxLength(100);

            builder.HasOne(x => x.Empresa)
                   .WithMany()
                   .HasForeignKey(x => x.EmpresaId);
        }
    }
}
