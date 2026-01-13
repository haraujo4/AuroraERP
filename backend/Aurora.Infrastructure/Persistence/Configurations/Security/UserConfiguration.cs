using Aurora.Domain.Entities.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aurora.Infrastructure.Persistence.Configurations.Security
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("Users");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Username)
                .IsRequired()
                .HasMaxLength(50);
            
            builder.HasIndex(x => x.Username)
                .IsUnique();

            builder.Property(x => x.Email)
                .IsRequired()
                .HasMaxLength(100);

            builder.HasIndex(x => x.Email)
                .IsUnique();

            builder.Property(x => x.PasswordHash)
                .IsRequired();

            // Configure Unidirectional Many-to-Many
            builder.HasMany(x => x.Roles)
                .WithMany() // No navigation property on Role side
                .UsingEntity(j => j.ToTable("UserRoles")); 
                // Keep table name, remove problematic SetPropertyAccessMode if needed.
                // Actually, let's remove strict PropertyAccessMode check which might be failing null check.
            
            // builder.Metadata.FindNavigation(nameof(User.Roles))!
            //    .SetPropertyAccessMode(PropertyAccessMode.Field);
        }
    }
}
