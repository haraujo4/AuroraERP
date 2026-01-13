import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
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
import { GoodsReceiptForm } from './pages/Logistics/Inventory/GoodsReceiptForm';
import { GoodsIssueForm } from './pages/Logistics/Inventory/GoodsIssueForm';
import { StockTransferForm } from './pages/Logistics/Inventory/StockTransferForm';
import { DeliveryList } from './pages/Logistics/Expedition/DeliveryList';
import { AccountList } from './pages/Finance/Accounts/AccountList';
import { AccountForm } from './pages/Finance/Accounts/AccountForm';
import { JournalEntryList } from './pages/Finance/JournalEntries/JournalEntryList';
import { JournalEntryForm } from './pages/Finance/JournalEntries/JournalEntryForm';
import { InvoiceList } from './pages/Finance/Invoices/InvoiceList';
import { InvoiceForm } from './pages/Finance/Invoices/InvoiceForm';
import MiroForm from './pages/Finance/Invoices/MiroForm';
import BillingForm from './pages/Finance/Invoices/BillingForm';
import { PaymentList } from './pages/Finance/Payments/PaymentList';
import PaymentForm from './pages/Finance/Payments/PaymentForm';
import { WorkCenterList } from './pages/Production/WorkCenters/WorkCenterList';
import { WorkCenterForm } from './pages/Production/WorkCenters/WorkCenterForm';
import { BillOfMaterialList } from './pages/Production/BOMs/BillOfMaterialList';
import { BillOfMaterialForm } from './pages/Production/BOMs/BillOfMaterialForm';
import { ProductionOrderList } from './pages/Production/Orders/ProductionOrderList';
import { ProductionOrderForm } from './pages/Production/Orders/ProductionOrderForm';
import PurchaseRequisitionList from './pages/Purchasing/Requisitions/PurchaseRequisitionList';
import PurchaseRequisitionForm from './pages/Purchasing/Requisitions/PurchaseRequisitionForm';
import PurchaseOrderList from './pages/Purchasing/Orders/PurchaseOrderList';
import PurchaseOrderForm from './pages/Purchasing/Orders/PurchaseOrderForm';
import TaxRuleList from './pages/Fiscal/TaxRules/TaxRuleList';
import TaxRuleForm from './pages/Fiscal/TaxRules/TaxRuleForm';
import FinancialReports from './pages/Analytics/FinancialReports';
import Login from "./pages/Security/Login";
import { authService } from "./services/authService";
import Dashboard from "./pages/Dashboard/Dashboard";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
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
          <Route path="logistics/inventory/in" element={<GoodsReceiptForm />} />
          <Route path="logistics/inventory/out" element={<GoodsIssueForm />} />
          <Route path="logistics/inventory/transfer" element={<StockTransferForm />} />
          <Route path="logistics/deliveries" element={<DeliveryList />} />

          <Route path="finance/accounts" element={<AccountList />} />
          <Route path="finance/accounts/new" element={<AccountForm />} />
          <Route path="finance/accounts/:id" element={<AccountForm />} />

          <Route path="finance/journal-entries" element={<JournalEntryList />} />
          <Route path="finance/journal-entries/new" element={<JournalEntryForm />} />

          <Route path="finance/invoices" element={<InvoiceList />} />
          <Route path="finance/invoices/new" element={<InvoiceForm />} />
          <Route path="finance/invoices/miro" element={<MiroForm />} />
          <Route path="finance/invoices/billing" element={<BillingForm />} />

          <Route path="finance/payments" element={<PaymentList />} />
          <Route path="finance/payments/new" element={<PaymentForm />} />

          <Route path="finance/reports" element={<FinancialReports />} />


          {/* Production */}
          <Route path="production/work-centers" element={<WorkCenterList />} />
          <Route path="production/work-centers/new" element={<WorkCenterForm />} />
          <Route path="production/boms" element={<BillOfMaterialList />} />
          <Route path="production/boms/new" element={<BillOfMaterialForm />} />
          <Route path="production/orders" element={<ProductionOrderList />} />
          <Route path="production/orders/new" element={<ProductionOrderForm />} />

          {/* Purchasing */}
          <Route path="purchasing/requisitions" element={<PurchaseRequisitionList />} />
          <Route path="purchasing/requisitions/new" element={<PurchaseRequisitionForm />} />
          <Route path="purchasing/orders" element={<PurchaseOrderList />} />
          <Route path="purchasing/orders/new" element={<PurchaseOrderForm />} />

          <Route path="fiscal/tax-rules" element={<TaxRuleList />} />
          <Route path="fiscal/tax-rules/new" element={<TaxRuleForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
