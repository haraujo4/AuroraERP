using System.IO;
using System.Threading.Tasks;

namespace Aurora.Application.Interfaces.Services
{
    public interface IFileStorageService
    {
        Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType);
        Task<Stream> GetFileAsync(string fileName);
    }
}
