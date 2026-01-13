namespace Aurora.Domain.Enums
{
    public enum TaxType
    {
        ICMS,
        IPI,
        PIS,
        COFINS,
        ISS
    }

    public enum OperationType
    {
        Sales,
        Purchase,
        Transfer,
        Return
    }

    public enum CstIcms
    {
        Cst00, // TRIBUTADA INTEGRALMENTE
        Cst10, // TRIBUTADA E COM COBRANÇA DO ICMS POR SUBSTITUIÇÃO TRIBUTÁRIA
        Cst20, // COM REDUÇÃO DE BASE DE CÁLCULO
        Cst30, // ISENTA OU NÃO TRIBUTADA E COM COBRANÇA DO ICMS POR SUBSTITUIÇÃO TRIBUTÁRIA
        Cst40, // ISENTA
        Cst41, // NÃO TRIBUTADA
        Cst50, // SUSPENSÃO
        Cst51, // DIFERIMENTO
        Cst60, // ICMS COBRADO ANTERIORMENTE POR SUBSTITUIÇÃO TRIBUTÁRIA
        Cst70, // COM REDUÇÃO DE BASE DE CÁLCULO E COBRANÇA DO ICMS POR SUBSTITUIÇÃO TRIBUTÁRIA
        Cst90  // OUTRAS
    }
}
