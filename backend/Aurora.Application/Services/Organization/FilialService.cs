using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aurora.Application.DTOs.Organization;
using Aurora.Application.Interfaces.Organization;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Entities.Organization;
using Aurora.Domain.ValueObjects;

namespace Aurora.Application.Services.Organization
{
    public class FilialService : IFilialService
    {
        private readonly IFilialRepository _repository;
        private readonly IRepository<Empresa> _empresaRepository;
        private readonly IRepository<Deposito> _depositoRepository;

        public FilialService(IFilialRepository repository, IRepository<Empresa> empresaRepository, IRepository<Deposito> depositoRepository)
        {
            _repository = repository;
            _empresaRepository = empresaRepository;
            _depositoRepository = depositoRepository;
        }

        public async Task<IEnumerable<DepositoDto>> GetDepositosAsync(Guid filialId)
        {
            var depositos = await _depositoRepository.GetAllAsync();
            return depositos.Where(d => d.FilialId == filialId)
                .Select(d => new DepositoDto
                {
                    Id = d.Id,
                    FilialId = d.FilialId,
                    Codigo = d.Codigo,
                    Descricao = d.Descricao,
                    Tipo = d.Tipo,
                    ControlaLote = d.ControlaLote,
                    ControlaSerie = d.ControlaSerie
                });
        }

        public async Task<DepositoDto> AddDepositoAsync(CreateDepositoDto dto)
        {
            var deposito = new Deposito(dto.Codigo, dto.Descricao, dto.Tipo, dto.ControlaLote, dto.ControlaSerie, dto.FilialId);
            
            await _depositoRepository.AddAsync(deposito);
            
            return new DepositoDto
            {
                Id = deposito.Id,
                FilialId = deposito.FilialId,
                Codigo = deposito.Codigo,
                Descricao = deposito.Descricao,
                Tipo = deposito.Tipo,
                ControlaLote = deposito.ControlaLote,
                ControlaSerie = deposito.ControlaSerie
            };
        }

        public async Task<IEnumerable<FilialDto>> GetAllAsync()
        {
            var filiais = await _repository.GetAllAsync();
            var dtos = new List<FilialDto>();

            // Optimisation: Retrieve Empresas to map names if needed, 
            // but for simplicity I'll fetch them individually or assume I should load them in Repo.
            // For now, simple loop. Note: GetAllAsync in Generic Repo doesn't include navigation props by default unless overridden.
            // I'll stick to basic mapping.
            
            foreach (var f in filiais)
            {
                var empresa = await _empresaRepository.GetByIdAsync(f.EmpresaId);
                dtos.Add(MapToDto(f, empresa?.RazaoSocial));
            }

            return dtos;
        }

        public async Task<FilialDto> GetByIdAsync(Guid id)
        {
            var filial = await _repository.GetByIdAsync(id);
            if (filial == null) return null;

            var empresa = await _empresaRepository.GetByIdAsync(filial.EmpresaId);
            return MapToDto(filial, empresa?.RazaoSocial);
        }

        public async Task<FilialDto> CreateAsync(CreateFilialDto dto)
        {
            var address = new Address(dto.Street, dto.Number, dto.Complement, dto.Neighborhood, dto.City, dto.State, dto.Country, dto.ZipCode);
            var filial = new Filial(dto.Codigo, dto.Descricao, dto.Tipo, address, dto.EmpresaId);

            await _repository.AddAsync(filial);
            
            var empresa = await _empresaRepository.GetByIdAsync(dto.EmpresaId);
            return MapToDto(filial, empresa?.RazaoSocial);
        }

         public async Task UpdateAsync(Guid id, CreateFilialDto dto)
        {
             var filial = await _repository.GetByIdAsync(id);
             if (filial == null) throw new Exception("Filial not found");

             var address = new Address(dto.Street, dto.Number, dto.Complement, dto.Neighborhood, dto.City, dto.State, dto.Country, dto.ZipCode);
             
             // Update properties using reflection or manual mapping since Setters are private and no Update method exists yet.
             // Best practice: Add Update method to Domain Entity.
             
             // Updating Entity via Reflection for now to respect private setters without modifying Domain heavily in this step
             // OR simpler: Add Update method to Filial.cs now.
             
             filial.Update(dto.Codigo, dto.Descricao, dto.Tipo, address, dto.EmpresaId);
             
             await _repository.UpdateAsync(filial);
        }

        private FilialDto MapToDto(Filial entity, string empresaName)
        {
            return new FilialDto
            {
                Id = entity.Id,
                EmpresaId = entity.EmpresaId,
                EmpresaName = empresaName ?? "Unknown",
                Codigo = entity.Codigo,
                Descricao = entity.Descricao,
                Tipo = entity.Tipo,
                Street = entity.EnderecoOperacional?.Street,
                Number = entity.EnderecoOperacional?.Number,
                Complement = entity.EnderecoOperacional?.Complement,
                Neighborhood = entity.EnderecoOperacional?.Neighborhood,
                City = entity.EnderecoOperacional?.City,
                State = entity.EnderecoOperacional?.State,
                Country = entity.EnderecoOperacional?.Country,
                ZipCode = entity.EnderecoOperacional?.ZipCode
            };
        }
    }
}
