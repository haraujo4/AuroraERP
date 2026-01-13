using System;
using Aurora.Domain.Common;

namespace Aurora.Domain.Entities.Security
{
    public class AuditLog : BaseEntity
    {
        public string EntityName { get; private set; }
        public string Action { get; private set; } // Create, Update, Delete
        public string? OldValues { get; private set; }
        public string? NewValues { get; private set; }
        public string? ChangedColumns { get; private set; }
        public string TableName { get; private set; }
        public Guid PrimaryKey { get; private set; }

        public AuditLog(string entityName, string action, string tableName, Guid primaryKey, string? oldValues = null, string? newValues = null, string? changedColumns = null)
        {
            EntityName = entityName;
            Action = action;
            TableName = tableName;
            PrimaryKey = primaryKey;
            OldValues = oldValues;
            NewValues = newValues;
            ChangedColumns = changedColumns;
        }

        // EF Core Constructor
        private AuditLog() { }
    }
}
