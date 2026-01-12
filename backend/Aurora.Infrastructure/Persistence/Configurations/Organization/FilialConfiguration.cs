using Aurora.Domain.Entities.Organization;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aurora.Infrastructure.Persistence.Configurations.Organization
{
    public class FilialConfiguration : IEntityTypeConfiguration<Filial>
    {
        public void Configure(EntityTypeBuilder<Filial> builder)
        {
            builder.ToTable("Filiais", "organization");

            builder.HasKey(x => x.Id);
            
            builder.Property(x => x.Codigo).HasMaxLength(10).IsRequired();
            builder.Property(x => x.Descricao).HasMaxLength(100).IsRequired();
            builder.Property(x => x.Tipo).HasMaxLength(20).IsRequired();

            // Value Object Mapping
            builder.OwnsOne(x => x.EnderecoOperacional, nav =>
            {
                nav.Property(p => p.Street).HasColumnName("Street").HasMaxLength(150);
                nav.Property(p => p.Number).HasColumnName("Number").HasMaxLength(20);
                nav.Property(p => p.Complement).HasColumnName("Complement").HasMaxLength(50);
                nav.Property(p => p.Neighborhood).HasColumnName("Neighborhood").HasMaxLength(100);
                nav.Property(p => p.City).HasColumnName("City").HasMaxLength(100);
                nav.Property(p => p.State).HasColumnName("State").HasMaxLength(50);
                nav.Property(p => p.Country).HasColumnName("Country").HasMaxLength(50);
                nav.Property(p => p.ZipCode).HasColumnName("ZipCode").HasMaxLength(20);
            });

            builder.HasOne(x => x.Empresa)
                   .WithMany(e => e.Filiais)
                   .HasForeignKey(x => x.EmpresaId);
        }
    }
}
