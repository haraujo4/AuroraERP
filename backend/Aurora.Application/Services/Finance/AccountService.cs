using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Finance;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.Finance;

namespace Aurora.Application.Services.Finance
{
    public class AccountService : IAccountService
    {
        private readonly IRepository<Account> _repository;

        public AccountService(IRepository<Account> repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<AccountDto>> GetAllAsync()
        {
            var accounts = await _repository.GetAllAsync();
            return accounts.Select(MapToDto);
        }

        public async Task<AccountDto> GetByIdAsync(Guid id)
        {
            var account = await _repository.GetByIdAsync(id);
            if (account == null) throw new Exception("Account not found");
            return MapToDto(account);
        }

        public async Task<AccountDto> CreateAsync(CreateAccountDto dto)
        {
            var account = new Account(dto.Code, dto.Name, dto.Type, dto.Nature, dto.Level, dto.ParentId);
            await _repository.AddAsync(account);
            return MapToDto(account);
        }

        public async Task UpdateAsync(Guid id, UpdateAccountDto dto)
        {
            var account = await _repository.GetByIdAsync(id);
            if (account == null) throw new Exception("Account not found");

            account.Update(dto.Name, dto.IsActive);
            await _repository.UpdateAsync(account);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _repository.DeleteAsync(id);
        }

        private AccountDto MapToDto(Account account)
        {
            return new AccountDto
            {
                Id = account.Id,
                Code = account.Code,
                Name = account.Name,
                Type = account.Type,
                Nature = account.Nature,
                Level = account.Level,
                IsActive = account.IsActive,
                ParentId = account.ParentId,
                ParentName = account.Parent?.Name
            };
        }
    }
}
