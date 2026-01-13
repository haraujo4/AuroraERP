using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Security;
using Aurora.Domain.Common;
using Aurora.Domain.Entities.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Aurora.Infrastructure.Persistence.Interceptors
{
    public class AuditInterceptor : SaveChangesInterceptor
    {
        private readonly ICurrentUserService _currentUserService;

        public AuditInterceptor(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        public override InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
        {
            AuditChanges(eventData.Context);
            return base.SavingChanges(eventData, result);
        }

        public override ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData, InterceptionResult<int> result, CancellationToken cancellationToken = default)
        {
            AuditChanges(eventData.Context);
            return base.SavingChangesAsync(eventData, result, cancellationToken);
        }

        private void AuditChanges(DbContext? context)
        {
            if (context == null) return;

            var username = _currentUserService.Username ?? "System";
            var timestamp = DateTime.UtcNow;

            var entries = context.ChangeTracker.Entries<BaseEntity>()
                .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified || e.State == EntityState.Deleted)
                .ToList();

            if (!entries.Any()) return;

            var auditEntries = new List<AuditLog>();

            foreach (var entry in entries)
            {
                if (entry.Entity is AuditLog) continue;

                var auditLog = MapToAuditLog(entry, username, timestamp);
                if (auditLog != null)
                {
                    auditEntries.Add(auditLog);
                }
            }

            if (auditEntries.Any())
            {
                context.Set<AuditLog>().AddRange(auditEntries);
            }
        }

        private AuditLog? MapToAuditLog(EntityEntry<BaseEntity> entry, string username, DateTime timestamp)
        {
            var entityName = entry.Entity.GetType().Name;
            var tableName = entry.Metadata.GetTableName() ?? entityName;
            var primaryKey = entry.Property("Id").CurrentValue != null ? (Guid)entry.Property("Id").CurrentValue! : Guid.Empty;

            var oldValues = new Dictionary<string, object?>();
            var newValues = new Dictionary<string, object?>();
            var changedColumns = new List<string>();

            string action = entry.State switch
            {
                EntityState.Added => "Create",
                EntityState.Modified => "Update",
                EntityState.Deleted => "Delete",
                _ => "Unknown"
            };

            foreach (var property in entry.Properties)
            {
                var propertyName = property.Metadata.Name;

                if (property.Metadata.IsPrimaryKey()) continue;

                switch (entry.State)
                {
                    case EntityState.Added:
                        newValues[propertyName] = property.CurrentValue;
                        break;

                    case EntityState.Deleted:
                        oldValues[propertyName] = property.OriginalValue;
                        break;

                    case EntityState.Modified:
                        if (property.IsModified)
                        {
                            changedColumns.Add(propertyName);
                            oldValues[propertyName] = property.OriginalValue;
                            newValues[propertyName] = property.CurrentValue;
                        }
                        break;
                }
            }

            return new AuditLog(
                entityName,
                action,
                tableName,
                primaryKey,
                oldValues.Any() ? JsonSerializer.Serialize(oldValues) : null,
                newValues.Any() ? JsonSerializer.Serialize(newValues) : null,
                changedColumns.Any() ? string.Join(", ", changedColumns) : null
            );
        }
    }
}
