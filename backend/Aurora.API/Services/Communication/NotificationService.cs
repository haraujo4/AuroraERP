using Aurora.API.Hubs;
using Aurora.Application.Interfaces.Communication;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace Aurora.API.Services.Communication
{
    public class NotificationService : INotificationService
    {
        private readonly IHubContext<NotificationHub> _hubContext;

        public NotificationService(IHubContext<NotificationHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task SendToAllAsync(string message, string type = "info")
        {
            await _hubContext.Clients.All.SendAsync("ReceiveNotification", message, type);
        }

        public async Task SendToUserAsync(string userId, string message, string type = "info")
        {
            await _hubContext.Clients.User(userId).SendAsync("ReceiveNotification", message, type);
        }
    }
}
