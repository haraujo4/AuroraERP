import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { GroupList } from "./pages/Organization/GroupList";
import { GroupForm } from "./pages/Organization/GroupForm";
import { CompanyList } from "./pages/Organization/CompanyList";
import { CompanyForm } from "./pages/Organization/CompanyForm";
import { BranchList } from "./pages/Organization/BranchList";
import { BranchForm } from "./pages/Organization/BranchForm";
import { BusinessPartnerList } from "./pages/CRM/BusinessPartnerList";
import { BusinessPartnerForm } from "./pages/CRM/BusinessPartnerForm";
import { LeadList } from "./pages/CRM/Leads/LeadList";
import { LeadForm } from "./pages/CRM/Leads/LeadForm";
import { OpportunityList } from "./pages/CRM/Opportunities/OpportunityList";
import { OpportunityForm } from "./pages/CRM/Opportunities/OpportunityForm";
import { SalesQuoteList } from './pages/Sales/Quotes/SalesQuoteList';
import { SalesQuoteForm } from './pages/Sales/Quotes/SalesQuoteForm';
import { SalesOrderList } from './pages/Sales/Orders/SalesOrderList';
import { SalesOrderForm } from './pages/Sales/Orders/SalesOrderForm';
import { SalesContractList } from './pages/Sales/Contracts/SalesContractList';
import { SalesContractForm } from './pages/Sales/Contracts/SalesContractForm';
import { MaterialList } from './pages/Logistics/Materials/MaterialList';
import { MaterialForm } from './pages/Logistics/Materials/MaterialForm';
import { StockList } from './pages/Logistics/Inventory/StockList';
import { StockAdjustmentForm } from './pages/Logistics/Inventory/StockAdjustmentForm';
import { DeliveryList } from './pages/Logistics/Expedition/DeliveryList';

function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-text-primary mb-4">Bem-vindo ao Aurora ERP</h1>
      <div className="bg-white p-6 rounded-lg border border-border-default shadow-sm max-w-2xl">
        <p className="text-text-secondary">
          Selecione um módulo no menu ou digite um código de transação (T-Code) na barra superior para começar.
        </p>
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="p-4 bg-bg-main rounded border border-border-default text-center">
            <span className="block font-bold text-brand-primary text-xl">12</span>
            <span className="text-xs text-text-secondary uppercase">Tarefas</span>
          </div>
          <div className="p-4 bg-bg-main rounded border border-border-default text-center">
            <span className="block font-bold text-status-success text-xl">OK</span>
            <span className="text-xs text-text-secondary uppercase">Status do Sistema</span>
          </div>
          <div className="p-4 bg-bg-main rounded border border-border-default text-center">
            <span className="block font-bold text-text-primary text-xl">0</span>
            <span className="text-xs text-text-secondary uppercase">Alertas</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="admin/groups" element={<GroupList />} />
          <Route path="admin/groups/new" element={<GroupForm />} />
          <Route path="admin/groups/:id" element={<GroupForm />} />

          <Route path="admin/companies" element={<CompanyList />} />
          <Route path="admin/companies/new" element={<CompanyForm />} />
          <Route path="admin/companies/:id" element={<CompanyForm />} />

          <Route path="admin/branches" element={<BranchList />} />
          <Route path="admin/branches/new" element={<BranchForm />} />
          <Route path="admin/branches/:id" element={<BranchForm />} />

          <Route path="crm/bp" element={<BusinessPartnerList />} />
          <Route path="crm/bp/new" element={<BusinessPartnerForm />} />
          <Route path="crm/bp/:id" element={<BusinessPartnerForm />} />

          <Route path="crm/leads" element={<LeadList />} />
          <Route path="crm/leads/new" element={<LeadForm />} />
          <Route path="crm/leads/:id" element={<LeadForm />} />

          <Route path="crm/opportunities" element={<OpportunityList />} />
          <Route path="crm/opportunities/new" element={<OpportunityForm />} />
          <Route path="crm/opportunities/:id" element={<OpportunityForm />} />

          <Route path="sales/quotes" element={<SalesQuoteList />} />
          <Route path="sales/quotes/new" element={<SalesQuoteForm />} />
          <Route path="sales/quotes/:id" element={<SalesQuoteForm />} />

          <Route path="sales/orders" element={<SalesOrderList />} />
          <Route path="sales/orders/new" element={<SalesOrderForm />} />
          <Route path="sales/orders/:id" element={<SalesOrderForm />} />

          <Route path="sales/contracts" element={<SalesContractList />} />
          <Route path="sales/contracts/new" element={<SalesContractForm />} />
          <Route path="sales/contracts/:id" element={<SalesContractForm />} />

          <Route path="logistics/materials" element={<MaterialList />} />
          <Route path="logistics/materials/new" element={<MaterialForm />} />
          <Route path="logistics/materials/:id" element={<MaterialForm />} />

          <Route path="logistics/inventory" element={<StockList />} />
          <Route path="logistics/inventory/movement" element={<StockAdjustmentForm />} />
          <Route path="logistics/deliveries" element={<DeliveryList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
