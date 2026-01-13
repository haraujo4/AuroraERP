using System.Threading.Tasks;

namespace Aurora.Application.Interfaces.Common
{
    public interface ICodeGenerationService
    {
        Task<string> GenerateNextCodeAsync<TEntity>(string prefix) where TEntity : class;
    }
}
