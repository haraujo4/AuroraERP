

export interface Lead {
    id: string;
    title: string;
    source: string;
    contactName: string;
    email: string;
    phone: string;
    companyName: string;
    status: 'New' | 'Contacted' | 'Qualified' | 'Lost' | 'Converted';
    estimatedValue?: number;
    notes?: string;
    createdAt: string;
}

export interface CreateLeadDto {
    title: string;
    source: string;
    contactName: string;
    email: string;
    phone: string;
    companyName: string;
    estimatedValue?: number;
    notes?: string;
}
