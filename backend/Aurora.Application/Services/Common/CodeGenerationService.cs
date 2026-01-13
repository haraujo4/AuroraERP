using System;
using System.Linq;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Common;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Common;

namespace Aurora.Application.Services.Common
{
    public class CodeGenerationService : ICodeGenerationService
    {
        private readonly IServiceProvider _serviceProvider;

        public CodeGenerationService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public async Task<string> GenerateNextCodeAsync<TEntity>(string prefix) where TEntity : class
        {
            var repositoryType = typeof(IRepository<>).MakeGenericType(typeof(TEntity));
            var repository = _serviceProvider.GetService(repositoryType);

            if (repository == null)
            {
                throw new InvalidOperationException($"Repository for {typeof(TEntity).Name} not found.");
            }

            var getAllMethod = repositoryType.GetMethod("GetAllAsync");
            var task = (Task<System.Collections.Generic.IEnumerable<TEntity>>)getAllMethod.Invoke(repository, new object[] { Array.Empty<System.Linq.Expressions.Expression<Func<TEntity, object>>>() });
            var entities = await task;

            int maxNumber = 0;
            string codePropertyName = GetCodePropertyName(typeof(TEntity));

            foreach (var entity in entities)
            {
                var property = entity.GetType().GetProperty(codePropertyName);
                if (property != null)
                {
                    var value = property.GetValue(entity) as string;
                    if (!string.IsNullOrEmpty(value) && value.StartsWith(prefix))
                    {
                        var numberPart = value.Substring(prefix.Length);
                        if (int.TryParse(numberPart, out int number))
                        {
                            if (number > maxNumber)
                            {
                                maxNumber = number;
                            }
                        }
                    }
                }
            }

            return $"{prefix}{(maxNumber + 1).ToString("D4")}";
        }

        private string GetCodePropertyName(Type type)
        {
            if (type.GetProperty("Codigo") != null) return "Codigo";
            if (type.GetProperty("Code") != null) return "Code";
            if (type.GetProperty("Number") != null) return "Number";
            
            throw new InvalidOperationException($"Entity {type.Name} does not have a recognized code property (Codigo, Code, or Number).");
        }
    }
}
