using Aurora.Application.Interfaces.Events;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Aurora.Infrastructure.Events
{
    public class InMemoryEventBus : IEventBus
    {
        private readonly IServiceProvider _serviceProvider;
        
        public InMemoryEventBus(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public async Task PublishAsync<T>(T @event) where T : IIntegrationEvent
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                // Resolve all handlers for this event type
                var handlers = scope.ServiceProvider.GetServices<IIntegrationEventHandler<T>>();
                
                foreach (var handler in handlers)
                {
                    await handler.Handle(@event);
                }
            }
        }

        public void Subscribe<T>(IIntegrationEventHandler<T> handler) where T : IIntegrationEvent
        {
            // Not used in DI-based approach
            throw new NotImplementedException("Use DI registration for handlers.");
        }
    }
}
