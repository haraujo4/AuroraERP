using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace Aurora.API.Hubs
{
    public class NotificationHub : Hub
    {
        // Define methods that clients can call, if necessary.
        // For now, we mainly push to clients.
        
        public async Task JoinGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        }

        public async Task LeaveGroup(string groupName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        }
    }
}
