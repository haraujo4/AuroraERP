export interface BusinessPartner {
    id: string;
    codigo: string;
    tipo: 'PessoaFisica' | 'PessoaJuridica';
    razaoSocial: string;
    nomeFantasia: string;
    cpfCnpj: string;
    rgIe: string;
    status: 'Active' | 'Blocked' | 'Inactive';
    addresses: BusinessPartnerAddress[];
    contacts: ContactPerson[];
}

export interface CreateBusinessPartnerDto {
    codigo: string;
    tipo: 'PessoaFisica' | 'PessoaJuridica';
    razaoSocial: string;
    nomeFantasia: string;
    cpfCnpj: string;
    rgIe: string;
    addresses: CreateAddressDto[];
}

export interface BusinessPartnerAddress {
    id: string;
    type: string;
    isPrincipal: boolean;
    street: string;
    number: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    neighborhood?: string;
    complement?: string;
}

export interface CreateAddressDto {
    type: string;
    isPrincipal: boolean;
    street: string;
    number: string;
    complement?: string;
    neighborhood?: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
}

export interface ContactPerson {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
}
