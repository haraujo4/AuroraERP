using Aurora.Domain.Entities.BusinessPartners;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aurora.Infrastructure.Persistence.Configurations.BusinessPartners
{
    public class BusinessPartnerConfiguration : IEntityTypeConfiguration<BusinessPartner>
    {
        public void Configure(EntityTypeBuilder<BusinessPartner> builder)
        {
            builder.ToTable("BusinessPartners", "commercial");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Codigo).HasMaxLength(20).IsRequired();
            builder.Property(x => x.RazaoSocial).HasMaxLength(150).IsRequired();
            builder.Property(x => x.NomeFantasia).HasMaxLength(150).IsRequired();
            builder.Property(x => x.CpfCnpj).HasMaxLength(20).IsRequired();
            builder.Property(x => x.RgIe).HasMaxLength(20).IsRequired(false);
            
            builder.Property(x => x.Tipo)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired();

            builder.Property(x => x.Status)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired();

            // Owned Entity Collection for Addresses
            builder.OwnsMany(x => x.Addresses, a =>
            {
                a.ToTable("BusinessPartnerAddresses", "commercial");
                a.HasKey(x => x.Id);
                a.WithOwner().HasForeignKey("BusinessPartnerId");
                
                a.Property(x => x.Type).HasMaxLength(20).IsRequired();
                
                a.OwnsOne(x => x.Address, nav =>
                {
                    nav.Property(p => p.Street).HasColumnName("Street").HasMaxLength(150);
                    nav.Property(p => p.Number).HasColumnName("Number").HasMaxLength(20);
                    nav.Property(p => p.Complement).HasColumnName("Complement").HasMaxLength(50).IsRequired(false);
                    nav.Property(p => p.Neighborhood).HasColumnName("Neighborhood").HasMaxLength(100).IsRequired(false);
                    nav.Property(p => p.City).HasColumnName("City").HasMaxLength(100);
                    nav.Property(p => p.State).HasColumnName("State").HasMaxLength(2);
                    nav.Property(p => p.Country).HasColumnName("Country").HasMaxLength(50).IsRequired(false);
                    nav.Property(p => p.ZipCode).HasColumnName("ZipCode").HasMaxLength(20);
                });
            });

            // Owned Entity Collection for Contacts
            builder.OwnsMany(x => x.Contacts, c =>
            {
                c.ToTable("BusinessPartnerContacts", "commercial");
                c.HasKey(x => x.Id);
                c.WithOwner().HasForeignKey("BusinessPartnerId");

                c.Property(x => x.Name).HasMaxLength(100).IsRequired();
                c.Property(x => x.Email).HasMaxLength(100);
                c.Property(x => x.Phone).HasMaxLength(20);
                c.Property(x => x.Role).HasMaxLength(50);
            });
        }
    }
}
