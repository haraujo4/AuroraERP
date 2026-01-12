using System;

namespace Aurora.Application.DTOs.Organization
{
    public class FilialDto
    {
        public Guid Id { get; set; }
        public Guid EmpresaId { get; set; }
        public string EmpresaName { get; set; }
        public string Codigo { get; set; }
        public string Descricao { get; set; }
        public string Tipo { get; set; }
        
        // Address flattened or object
        public string Street { get; set; }
        public string Number { get; set; }
        public string Complement { get; set; }
        public string Neighborhood { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string ZipCode { get; set; }
    }

    public class CreateFilialDto
    {
        public Guid EmpresaId { get; set; }
        public string Codigo { get; set; }
        public string Descricao { get; set; }
        public string Tipo { get; set; }
        
        // Address
        public string Street { get; set; }
        public string Number { get; set; }
        public string Complement { get; set; }
        public string Neighborhood { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string ZipCode { get; set; }
    }
}
