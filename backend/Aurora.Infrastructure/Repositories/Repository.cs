using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Repositories;
using Aurora.Domain.Common;
using Aurora.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Aurora.Infrastructure.Repositories
{
    public class Repository<T> : IRepository<T> where T : BaseEntity
    {
        protected readonly AuroraDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public Repository(AuroraDbContext context)
        {
            _context = context;
            try
            {
                _dbSet = context.Set<T>();
            }
            catch (Exception ex)
            {
                var innerMsg = ex.InnerException?.Message ?? "No inner exception";
                Console.WriteLine($"Error initializing Repository for type {typeof(T).Name}: {ex.Message}");
                Console.WriteLine($"Inner Exception: {innerMsg}");
                Console.WriteLine(ex.StackTrace);
                if (ex.InnerException != null) Console.WriteLine(ex.InnerException.StackTrace);

                throw new InvalidOperationException($"Failed to create Set for {typeof(T).Name}", ex);
            }
        }

        public virtual async Task<T?> GetByIdAsync(Guid id, params Expression<Func<T, object>>[] includes)
        {
            IQueryable<T> query = _dbSet;
            foreach (var include in includes)
            {
                query = query.Include(include);
            }
            return await query.FirstOrDefaultAsync(e => e.Id == id);
        }

        public virtual async Task<IEnumerable<T>> GetAllAsync(params Expression<Func<T, object>>[] includes)
        {
            IQueryable<T> query = _dbSet;
            foreach (var include in includes)
            {
                query = query.Include(include);
            }
            return await query.ToListAsync();
        }

        public virtual async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate, params Expression<Func<T, object>>[] includes)
        {
            IQueryable<T> query = _dbSet;
            foreach (var include in includes)
            {
                query = query.Include(include);
            }
            return await query.Where(predicate).ToListAsync();
        }

        public async Task AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(T entity)
        {
            _dbSet.Update(entity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                _dbSet.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }
    }
}
