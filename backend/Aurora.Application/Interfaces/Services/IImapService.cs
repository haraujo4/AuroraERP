using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Domain.Entities.Communication; // Reusing EmailMessage model if possible or create new DTO

namespace Aurora.Application.Interfaces.Services
{
    public interface IImapService
    {
        Task<List<Domain.Models.IncomingEmailMessage>> GetUnprocessedEmailsAsync();
    }
}
