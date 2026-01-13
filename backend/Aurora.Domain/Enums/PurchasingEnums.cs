namespace Aurora.Domain.Enums
{
    public enum PurchasingStatus
    {
        Draft = 0,
        PendingApproval = 1,
        Approved = 2,
        Rejected = 3,
        Ordered = 4, // Conversão de Req para PO, ou PO enviada
        Partial = 5, // Recebimento Parcial
        Completed = 6, // Recebimento Total
        Cancelled = 99
    }

    public enum PurchaseType
    {
        Standard = 0,
        Service = 1,
        Consignment = 2,
        Subcontracting = 3
    }
}
