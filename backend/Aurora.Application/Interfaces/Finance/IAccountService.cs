using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aurora.Domain.Entities.Finance;
using Aurora.Domain.Enums;

namespace Aurora.Application.Interfaces.Finance
{
    public interface IAccountService
    {
        Task<IEnumerable<AccountDto>> GetAllAsync();
        Task<AccountDto> GetByIdAsync(Guid id);
        Task<AccountDto> CreateAsync(CreateAccountDto dto);
        Task UpdateAsync(Guid id, UpdateAccountDto dto);
        Task DeleteAsync(Guid id);
    }

    public class AccountDto
    {
        public Guid Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public AccountType Type { get; set; }
        public AccountNature Nature { get; set; }
        public int Level { get; set; }
        public bool IsActive { get; set; }
        public Guid? ParentId { get; set; }
        public string? ParentName { get; set; }
    }

    public class CreateAccountDto
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public AccountType Type { get; set; }
        public AccountNature Nature { get; set; }
        public int Level { get; set; }
        public Guid? ParentId { get; set; }
    }

    public class UpdateAccountDto
    {
        public string Name { get; set; }
        public bool IsActive { get; set; }
    }
}
