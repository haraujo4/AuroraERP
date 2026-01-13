using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.Fiscal;
using Aurora.Infrastructure.Persistence;

namespace Aurora.Infrastructure.Repositories.Fiscal
{
    public class FiscalDocumentRepository : Repository<FiscalDocument>, IFiscalDocumentRepository
    {
        public FiscalDocumentRepository(AuroraDbContext context) : base(context)
        {
        }
    }
}
