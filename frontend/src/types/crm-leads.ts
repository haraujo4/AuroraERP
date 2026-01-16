


export interface LeadInteraction {
    id: string;
    type: 'IncomingEmail' | 'OutgoingEmail' | 'Note' | 'Call';
    body: string;
    sentAt: string;
}

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
    isCustomer: boolean;
    interactions: LeadInteraction[];
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

