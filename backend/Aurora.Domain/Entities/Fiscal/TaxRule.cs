using System;
using Aurora.Domain.Common;
using Aurora.Domain.Enums;

namespace Aurora.Domain.Entities.Fiscal
{
    public class TaxRule : BaseEntity
    {
        // Criteria (Inputs)
        public string? NcmCode { get; private set; } // If null, applies to all
        public string SourceState { get; private set; } // UF Origem (e.g., "SP")
        public string DestState { get; private set; }   // UF Destino
        public OperationType OperationType { get; private set; }

        // Results (Outputs)
        public int Cfop { get; private set; }
        public CstIcms CstIcms { get; private set; }
        public decimal IcmsRate { get; private set; }
        public decimal IpiRate { get; private set; }
        public decimal PisRate { get; private set; }
        public decimal CofinsRate { get; private set; }

        private TaxRule() { }

        public TaxRule(
            string sourceState,
            string destState,
            OperationType operationType,
            int cfop,
            decimal icmsRate,
            decimal ipiRate,
            decimal pisRate,
            decimal cofinsRate,
            CstIcms cstIcms,
            string? ncmCode = null)
        {
            if (string.IsNullOrWhiteSpace(sourceState)) throw new ArgumentNullException(nameof(sourceState));
            if (string.IsNullOrWhiteSpace(destState)) throw new ArgumentNullException(nameof(destState));

            SourceState = sourceState.ToUpper();
            DestState = destState.ToUpper();
            OperationType = operationType;
            Cfop = cfop;
            IcmsRate = icmsRate;
            IpiRate = ipiRate;
            PisRate = pisRate;
            CofinsRate = cofinsRate;
            CstIcms = cstIcms;
            NcmCode = ncmCode;
        }

        public void Update(
            string sourceState,
            string destState,
            OperationType operationType,
            int cfop,
            decimal icmsRate,
            decimal ipiRate,
            decimal pisRate,
            decimal cofinsRate,
            CstIcms cstIcms,
            string? ncmCode)
        {
            if (string.IsNullOrWhiteSpace(sourceState)) throw new ArgumentNullException(nameof(sourceState));
            if (string.IsNullOrWhiteSpace(destState)) throw new ArgumentNullException(nameof(destState));

            SourceState = sourceState.ToUpper();
            DestState = destState.ToUpper();
            OperationType = operationType;
            Cfop = cfop;
            IcmsRate = icmsRate;
            IpiRate = ipiRate;
            PisRate = pisRate;
            CofinsRate = cofinsRate;
            CstIcms = cstIcms;
            NcmCode = ncmCode;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
