using System;

namespace Aurora.Application.Interfaces.Security
{
    public interface ICurrentUserService
    {
        string? UserId { get; }
        string? Username { get; }
    }
}
