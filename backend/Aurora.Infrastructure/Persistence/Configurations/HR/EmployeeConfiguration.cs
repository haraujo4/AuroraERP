using Aurora.Domain.Entities.HR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aurora.Infrastructure.Persistence.Configurations.HR
{
    public class EmployeeConfiguration : IEntityTypeConfiguration<Employee>
    {
        public void Configure(EntityTypeBuilder<Employee> builder)
        {
            builder.ToTable("Employees");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.FullName)
                .IsRequired()
                .HasMaxLength(150);

            builder.Property(x => x.Email)
                .IsRequired()
                .HasMaxLength(100);

            builder.HasIndex(x => x.Email)
                .IsUnique();

            builder.Property(x => x.Phone)
                .HasMaxLength(20);

            builder.Property(x => x.JobTitleId).IsRequired();
            builder.Property(x => x.DepartmentId).IsRequired();

            // Configure Address as Owned Type
            builder.OwnsOne(x => x.Address, a =>
            {
                a.Property(p => p.Street).HasMaxLength(150).HasColumnName("Street");
                a.Property(p => p.Number).HasMaxLength(20).HasColumnName("Number");
                a.Property(p => p.Complement).HasMaxLength(50).HasColumnName("Complement");
                a.Property(p => p.Neighborhood).HasMaxLength(100).HasColumnName("Neighborhood");
                a.Property(p => p.City).HasMaxLength(100).HasColumnName("City");
                a.Property(p => p.State).HasMaxLength(2).HasColumnName("State");
                a.Property(p => p.ZipCode).HasMaxLength(20).HasColumnName("ZipCode");
            });

            // Relationships
            builder.HasOne(x => x.Department)
                .WithMany(x => x.Employees)
                .HasForeignKey(x => x.DepartmentId);

            builder.HasOne(x => x.JobTitle)
                .WithMany()
                .HasForeignKey(x => x.JobTitleId);
        }
    }
}
