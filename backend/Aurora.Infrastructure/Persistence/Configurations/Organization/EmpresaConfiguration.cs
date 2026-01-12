using Aurora.Domain.Entities.Organization;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aurora.Infrastructure.Persistence.Configurations.Organization
{
    public class EmpresaConfiguration : IEntityTypeConfiguration<Empresa>
    {
        public void Configure(EntityTypeBuilder<Empresa> builder)
        {
            builder.ToTable("Empresas", "organization");

            builder.HasKey(x => x.Id);
            
            builder.Property(x => x.Codigo).HasMaxLength(10).IsRequired();
            builder.Property(x => x.RazaoSocial).HasMaxLength(100).IsRequired();
            builder.Property(x => x.NomeFantasia).HasMaxLength(100).IsRequired();
            builder.Property(x => x.CNPJ).HasMaxLength(14).IsRequired(); // No mask

            builder.Property(x => x.InscricaoEstadual).HasMaxLength(20).IsRequired(false);
            builder.Property(x => x.InscricaoMunicipal).HasMaxLength(20).IsRequired(false);
            builder.Property(x => x.CNAEPrincipal).HasMaxLength(20).IsRequired(false);
            builder.Property(x => x.NaturezaJuridica).HasMaxLength(100).IsRequired(false);
            builder.Property(x => x.RegimeTributario).HasMaxLength(50).IsRequired(false);
            builder.Property(x => x.MoedaLocal).HasMaxLength(3).IsRequired(false);
            
            // Value Object Mapping (Address)
            builder.OwnsOne(x => x.EnderecoFiscal, nav =>
            {
                nav.Property(p => p.Street).HasColumnName("Street").HasMaxLength(150);
                nav.Property(p => p.Number).HasColumnName("Number").HasMaxLength(20);
                nav.Property(p => p.Complement).HasColumnName("Complement").HasMaxLength(50);
                nav.Property(p => p.Neighborhood).HasColumnName("Neighborhood").HasMaxLength(100);
                nav.Property(p => p.City).HasColumnName("City").HasMaxLength(100);
                nav.Property(p => p.State).HasColumnName("State").HasMaxLength(2);
                nav.Property(p => p.Country).HasColumnName("Country").HasMaxLength(50);
                nav.Property(p => p.ZipCode).HasColumnName("ZipCode").HasMaxLength(20);
            });

            // Relationships
            builder.HasOne(x => x.GrupoEmpresarial)
                   .WithMany(g => g.Empresas)
                   .HasForeignKey(x => x.GrupoEmpresarialId);
        }
    }
}
