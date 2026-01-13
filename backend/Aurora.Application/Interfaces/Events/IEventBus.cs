using System.Threading.Tasks;

namespace Aurora.Application.Interfaces.Events
{
    public interface IIntegrationEvent
    {
        Guid Id { get; }
        DateTime OccurredOn { get; }
    }

    public interface IEventBus
    {
        Task PublishAsync<T>(T @event) where T : IIntegrationEvent;
        void Subscribe<T>(IIntegrationEventHandler<T> handler) where T : IIntegrationEvent;
    }

    public interface IIntegrationEventHandler<in T> where T : IIntegrationEvent
    {
        Task Handle(T @event);
    }
}
