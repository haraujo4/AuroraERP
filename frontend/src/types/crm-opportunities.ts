export interface Opportunity {
    id: string;
    title: string;
    businessPartnerId?: string;
    businessPartnerName?: string;
    leadId?: string;
    leadName?: string;
    estimatedValue: number;
    closeDate: string;
    probability: number;
    stage: 'Prospecting' | 'Qualification' | 'Proposal' | 'Negotiation' | 'ClosedWon' | 'ClosedLost';
    createdAt: string;
}

export interface CreateOpportunityDto {
    title: string;
    businessPartnerId?: string;
    leadId?: string;
    estimatedValue: number;
    closeDate: string;
}
