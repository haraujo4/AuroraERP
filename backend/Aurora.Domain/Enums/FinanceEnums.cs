namespace Aurora.Domain.Enums
{
    public enum InvoiceType
    {
        Inbound,  // Vendor Invoice (Payable)
        Outbound  // Customer Invoice (Receivable)
    }

    public enum InvoiceStatus
    {
        Draft,
        Posted,
        Paid,
        Cancelled
    }

    public enum PaymentMethod
    {
        Cash,
        BankTransfer,
        CreditCard,
        Check,
        Other
    }

    public enum PaymentStatus
    {
        Draft,
        Posted,
        Cancelled
    }
}
