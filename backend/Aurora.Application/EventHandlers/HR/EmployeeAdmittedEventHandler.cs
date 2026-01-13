using Aurora.Application.Events.HR;
using Aurora.Application.Interfaces.Events;
using Aurora.Application.Interfaces.Communication;
using System.Threading.Tasks;

namespace Aurora.Application.EventHandlers.HR
{
    public class EmployeeAdmittedEventHandler : IIntegrationEventHandler<EmployeeAdmittedEvent>
    {
        private readonly INotificationService _notificationService;

        public EmployeeAdmittedEventHandler(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        public async Task Handle(EmployeeAdmittedEvent @event)
        {
            await _notificationService.SendToAllAsync(
                $"Novo colaborador admitido: {@event.EmployeeName} no departamento {@event.DepartmentName}", 
                "success"
            );
        }
    }
}
