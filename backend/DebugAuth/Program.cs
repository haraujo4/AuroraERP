using System;
using Npgsql;
using BCrypt.Net;

class Program
{
    static void Main(string[] args)
    {
        string connString = "Host=localhost;Port=5432;Database=aurora_erp;Username=appuser;Password=apppass";
        string username = "admin";
        string password = "admin123";

        Console.WriteLine($"Conectando ao banco...");

        try 
        {
            using var conn = new NpgsqlConnection(connString);
            conn.Open();

            using var cmd = new NpgsqlCommand("SELECT \"PasswordHash\" FROM \"Users\" WHERE \"Username\" = @u", conn);
            cmd.Parameters.AddWithValue("u", username);

            var hash = cmd.ExecuteScalar() as string;

            if (hash == null)
            {
                Console.WriteLine("ERRO: Usuário 'admin' não encontrado no banco de dados!");
                return;
            }

            Console.WriteLine($"Hash recuperado do banco: {hash}");
            
            bool valid = BCrypt.Net.BCrypt.Verify(password, hash);
            Console.WriteLine($"Verificação de senha '{password}': {(valid ? "SUCESSO" : "FALHA")}");

            string newHash = BCrypt.Net.BCrypt.HashPassword(password);
            Console.WriteLine($"Novo Hash gerado (para comparação): {newHash}");
            
            bool validNew = BCrypt.Net.BCrypt.Verify(password, newHash);
            Console.WriteLine($"Autoverificação do novo hash: {(validNew ? "SUCESSO" : "FALHA")}");
            
            // Check if hash starts with $2a$ or $2b$ or slightly different
             if (hash.Length >= 4)
            {
                Console.WriteLine($"Versão do hash: {hash.Substring(0, 4)}");
            }

        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erro crítico: {ex.Message}");
            Console.WriteLine(ex.StackTrace);
        }
    }
}
