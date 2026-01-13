using System.Threading.Tasks;

namespace Aurora.Application.Interfaces.Communication
{
    public interface INotificationService
    {
        Task SendToAllAsync(string message, string type = "info");
        Task SendToUserAsync(string userId, string message, string type = "info");
    }
}
