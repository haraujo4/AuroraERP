export interface GrupoEmpresarial {
    id: string;
    codigo: string;
    razaoSocialConsolidada: string;
    nomeFantasia: string;
    paisConsolidacao: string;
    moedaBase: string;
    idiomaPadrao: string;
    regimeFiscalConsolidado: string;
    isActive: boolean;
}

export interface CreateGrupoEmpresarialDto {
    codigo: string;
    razaoSocialConsolidada: string;
    nomeFantasia: string;
    paisConsolidacao: string;
    moedaBase: string;
    idiomaPadrao: string;
    regimeFiscalConsolidado: string;
}

export interface Empresa {
    id: string;
    grupoEmpresarialId: string;
    codigo: string;
    razaoSocial: string;
    nomeFantasia: string;
    cnpj: string;
    isActive: boolean;
}

export interface CreateEmpresaDto {
    grupoEmpresarialId: string;
    codigo: string;
    razaoSocial: string;
    nomeFantasia: string;
    cnpj: string;
}

export interface Branch {
    id: string;
    empresaId: string;
    empresaName: string;
    codigo: string;
    descricao: string;
    tipo: string;
    isActive: boolean;
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
}

export interface CreateBranchDto {
    empresaId: string;
    codigo: string;
    descricao: string;
    tipo: string;
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
}

export interface Deposito {
    id: string;
    filialId: string;
    codigo: string;
    descricao: string;
    tipo: string;
    controlaLote: boolean;
    controlaSerie: boolean;
}

export interface CreateDepositoDto {
    filialId: string;
    codigo: string;
    descricao: string;
    tipo: string;
    controlaLote: boolean;
    controlaSerie: boolean;
}
