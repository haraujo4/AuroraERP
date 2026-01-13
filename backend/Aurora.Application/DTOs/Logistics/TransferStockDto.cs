using System;
using Aurora.Domain.Enums;

namespace Aurora.Application.DTOs.Logistics
{
    public class TransferStockDto
    {
        public Guid MaterialId { get; set; }
        public Guid SourceDepositoId { get; set; }
        public Guid DestinationDepositoId { get; set; }
        public decimal Quantity { get; set; }
        public string? BatchNumber { get; set; }
        public string ReferenceDocument { get; set; }
    }
}
