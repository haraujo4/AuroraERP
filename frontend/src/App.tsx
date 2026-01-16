import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { SignalRProvider } from './contexts/SignalRContext';
import { Toaster } from 'react-hot-toast';
import { authService } from "./services/authService";

// Organization
import { GroupList } from "./pages/Organization/GroupList";
import { GroupForm } from "./pages/Organization/GroupForm";
import { CompanyList } from "./pages/Organization/CompanyList";
import { CompanyForm } from "./pages/Organization/CompanyForm";
import { BranchList } from "./pages/Organization/BranchList";
import { BranchForm } from "./pages/Organization/BranchForm";
import { CostCenterList } from "./pages/Organization/CostCenterList";
import { CostCenterForm } from "./pages/Organization/CostCenterForm";
import { ProfitCenterList } from "./pages/Organization/ProfitCenterList";
import { ProfitCenterForm } from "./pages/Organization/ProfitCenterForm";

// CRM
import { BusinessPartnerList } from "./pages/CRM/BusinessPartnerList";
import { BusinessPartnerForm } from "./pages/CRM/BusinessPartnerForm";
import { LeadList } from "./pages/CRM/Leads/LeadList";
import { LeadForm } from "./pages/CRM/Leads/LeadForm";
import { OpportunityList } from "./pages/CRM/Opportunities/OpportunityList";
import { OpportunityForm } from "./pages/CRM/Opportunities/OpportunityForm";

// Sales
import { SalesQuoteList } from './pages/Sales/Quotes/SalesQuoteList';
import { SalesQuoteForm } from './pages/Sales/Quotes/SalesQuoteForm';
import { SalesOrderList } from './pages/Sales/Orders/SalesOrderList';
import { SalesOrderForm } from './pages/Sales/Orders/SalesOrderForm';
import { SalesContractList } from './pages/Sales/Contracts/SalesContractList';
import { SalesContractForm } from './pages/Sales/Contracts/SalesContractForm';

// Logistics
import { MaterialList } from './pages/Logistics/Materials/MaterialList';
import { MaterialForm } from './pages/Logistics/Materials/MaterialForm';
import { StockList } from './pages/Logistics/Inventory/StockList';
import { GoodsReceiptForm } from './pages/Logistics/Inventory/GoodsReceiptForm';
import { GoodsIssueForm } from './pages/Logistics/Inventory/GoodsIssueForm';
import { StockTransferForm } from './pages/Logistics/Inventory/StockTransferForm';
import { StockAdjustmentForm } from './pages/Logistics/Inventory/StockAdjustmentForm';
import { DeliveryList } from './pages/Logistics/Expedition/DeliveryList';
import { WarehouseList } from './pages/Logistics/Warehouses/WarehouseList';
import { WarehouseForm } from './pages/Logistics/Warehouses/WarehouseForm';
import { StorageLocationList } from './pages/Logistics/Warehouses/StorageLocationList';
import { StorageLocationForm } from './pages/Logistics/Warehouses/StorageLocationForm';
import MigoPage from './pages/Logistics/Migo/MigoPage';
import InventoryCreatePage from './pages/Logistics/Inventory/InventoryCreatePage';
import InventoryCountPage from './pages/Logistics/Inventory/InventoryCountPage';
import InventoryPostPage from './pages/Logistics/Inventory/InventoryPostPage';

// Finance
import { AccountList } from './pages/Finance/Accounts/AccountList';
import { AccountForm } from './pages/Finance/Accounts/AccountForm';
import { JournalEntryList } from './pages/Finance/JournalEntries/JournalEntryList';
import { JournalEntryForm } from './pages/Finance/JournalEntries/JournalEntryForm';
import { InvoiceList } from './pages/Finance/Invoices/InvoiceList';
import { InvoiceForm } from './pages/Finance/Invoices/InvoiceForm';
import { BillingForm } from './pages/Finance/Invoices/BillingForm';
import { MiroForm } from './pages/Finance/Invoices/MiroForm';
import { PaymentList } from './pages/Finance/Payments/PaymentList';
import PaymentForm from './pages/Finance/Payments/PaymentForm';
import { ClearingPage } from './pages/Finance/Clearing/ClearingPage';
import ReversalPage from './pages/Finance/Clearing/ReversalPage';

// Production
import { WorkCenterList } from './pages/Production/WorkCenters/WorkCenterList';
import { WorkCenterForm } from './pages/Production/WorkCenters/WorkCenterForm';
import { BillOfMaterialList } from './pages/Production/BOMs/BillOfMaterialList';
import { BillOfMaterialForm } from './pages/Production/BOMs/BillOfMaterialForm';
import { ProductionOrderList } from './pages/Production/Orders/ProductionOrderList';
import { ProductionOrderForm } from './pages/Production/Orders/ProductionOrderForm';

// Purchasing
import PurchaseRequisitionList from './pages/Purchasing/Requisitions/PurchaseRequisitionList';
import PurchaseRequisitionForm from './pages/Purchasing/Requisitions/PurchaseRequisitionForm';
import PurchaseOrderList from './pages/Purchasing/Orders/PurchaseOrderList';
import PurchaseOrderForm from './pages/Purchasing/Orders/PurchaseOrderForm';

// HR
import { EmployeeList } from "./pages/HR/Employees/EmployeeList";
import { EmployeeForm } from "./pages/HR/Employees/EmployeeForm";

// Fiscal
import TaxRuleList from "./pages/Fiscal/TaxRules/TaxRuleList";
import TaxRuleForm from "./pages/Fiscal/TaxRules/TaxRuleForm";

// Planning
import MRPRun from "./pages/Planning/MRPRun";

// Analytics
import FinancialReports from "./pages/Analytics/FinancialReports";

// User Profile & Settings
import Login from "./pages/Security/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import { ProfilePage } from "./pages/Settings/Profile/ProfilePage";
import { SettingsLayout } from "./pages/Settings/SettingsLayout";
import { UserList } from "./pages/Settings/Users/UserList";
import { CompanySettings } from "./pages/Settings/Company/CompanySettings";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <SignalRProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />

            {/* Organization */}
            <Route path="admin/groups" element={<GroupList />} />
            <Route path="admin/groups/new" element={<GroupForm />} />
            <Route path="admin/groups/:id" element={<GroupForm />} />
            <Route path="base/groups" element={<GroupList />} />

            <Route path="admin/companies" element={<CompanyList />} />
            <Route path="admin/companies/new" element={<CompanyForm />} />
            <Route path="admin/companies/:id" element={<CompanyForm />} />
            <Route path="base/companies" element={<CompanyList />} />
            <Route path="base/companies/new" element={<CompanyForm />} />

            <Route path="admin/branches" element={<BranchList />} />
            <Route path="admin/branches/new" element={<BranchForm />} />
            <Route path="admin/branches/:id" element={<BranchForm />} />
            <Route path="base/branches" element={<BranchList />} />
            <Route path="base/branches/new" element={<BranchForm />} />

            <Route path="admin/cost-centers" element={<CostCenterList />} />
            <Route path="admin/cost-centers/new" element={<CostCenterForm />} />
            <Route path="admin/profit-centers" element={<ProfitCenterList />} />
            <Route path="admin/profit-centers/new" element={<ProfitCenterForm />} />

            {/* CRM */}
            <Route path="crm/bp" element={<BusinessPartnerList />} />
            <Route path="crm/bp/new" element={<BusinessPartnerForm />} />
            <Route path="crm/bp/:id" element={<BusinessPartnerForm />} />
            <Route path="crm/business-partners" element={<BusinessPartnerList />} />

            <Route path="crm/leads" element={<LeadList />} />
            <Route path="crm/leads/new" element={<LeadForm />} />
            <Route path="crm/leads/:id" element={<LeadForm />} />
            <Route path="crm/leads/:id" element={<LeadForm />} />

            <Route path="crm/opportunities" element={<OpportunityList />} />
            <Route path="crm/opportunities/new" element={<OpportunityForm />} />
            <Route path="crm/opportunities/:id" element={<OpportunityForm />} />

            {/* Logistics */}
            <Route path="logistics/materials" element={<MaterialList />} />
            <Route path="logistics/materials/new" element={<MaterialForm />} />
            <Route path="logistics/materials/:id" element={<MaterialForm />} />
            <Route path="logistics/inventory" element={<StockList />} />
            <Route path="logistics/migo" element={<MigoPage />} />
            <Route path="logistics/inventory/movement" element={<StockAdjustmentForm />} />
            <Route path="logistics/inventory/in" element={<GoodsReceiptForm />} />
            <Route path="logistics/inventory/out" element={<GoodsIssueForm />} />
            <Route path="logistics/inventory/transfer" element={<StockTransferForm />} />
            <Route path="logistics/inventory/adjustment" element={<StockAdjustmentForm />} />
            <Route path="logistics/deliveries" element={<DeliveryList />} />
            <Route path="logistics/warehouses" element={<WarehouseList />} />
            <Route path="logistics/warehouses/new" element={<WarehouseForm />} />
            <Route path="logistics/warehouses/:id" element={<WarehouseForm />} />
            <Route path="logistics/storage-locations" element={<StorageLocationList />} />
            <Route path="logistics/storage-locations/new" element={<StorageLocationForm />} />
            <Route path="logistics/storage-locations/new" element={<StorageLocationForm />} />
            <Route path="logistics/storage-locations/:id" element={<StorageLocationForm />} />

            <Route path="logistics/inventory/create" element={<InventoryCreatePage />} />
            <Route path="logistics/physical-inventory" element={<Navigate to="/logistics/inventory/create" replace />} />
            <Route path="logistics/inventory/count" element={<InventoryCountPage />} />
            <Route path="logistics/inventory/post" element={<InventoryPostPage />} />

            {/* Sales */}
            <Route path="sales/quotes" element={<SalesQuoteList />} />
            <Route path="sales/quotes/new" element={<SalesQuoteForm />} />
            <Route path="sales/quotes" element={<SalesQuoteList />} />
            <Route path="sales/quotes/new" element={<SalesQuoteForm />} />
            <Route path="sales/quotes/:id" element={<SalesQuoteForm />} />
            <Route path="sales/orders" element={<SalesOrderList />} />
            <Route path="sales/orders/new" element={<SalesOrderForm />} />
            <Route path="sales/orders/:id" element={<SalesOrderForm />} />
            <Route path="sales/contracts" element={<SalesContractList />} />
            <Route path="sales/contracts/new" element={<SalesContractForm />} />
            <Route path="sales/contracts/:id" element={<SalesContractForm />} />
            <Route path="sales/contracts/:id" element={<SalesContractForm />} />

            {/* Production */}
            <Route path="production/orders" element={<ProductionOrderList />} />
            <Route path="production/orders/new" element={<ProductionOrderForm />} />
            <Route path="production/orders" element={<ProductionOrderList />} />
            <Route path="production/orders/new" element={<ProductionOrderForm />} />
            <Route path="production/orders/:id" element={<ProductionOrderForm />} />
            <Route path="production/work-centers" element={<WorkCenterList />} />
            <Route path="production/work-centers/new" element={<WorkCenterForm />} />
            <Route path="production/work-centers/:id" element={<WorkCenterForm />} />
            <Route path="production/boms" element={<BillOfMaterialList />} />
            <Route path="production/boms/new" element={<BillOfMaterialForm />} />
            <Route path="production/boms/:id" element={<BillOfMaterialForm />} />
            <Route path="production/boms/:id" element={<BillOfMaterialForm />} />

            {/* Purchasing */}
            <Route path="purchasing/requisitions" element={<PurchaseRequisitionList />} />
            <Route path="purchasing/requisitions" element={<PurchaseRequisitionList />} />
            <Route path="purchasing/requisitions/new" element={<PurchaseRequisitionForm />} />
            <Route path="purchasing/requisitions/:id" element={<PurchaseRequisitionForm />} />
            <Route path="purchasing/orders" element={<PurchaseOrderList />} />
            <Route path="purchasing/orders/new" element={<PurchaseOrderForm />} />
            <Route path="purchasing/orders/:id" element={<PurchaseOrderForm />} />
            <Route path="purchasing/orders/:id" element={<PurchaseOrderForm />} />

            {/* Planning */}
            <Route path="planning/mrp" element={<MRPRun />} />
            <Route path="production/mrp" element={<MRPRun />} />

            {/* Finance */}
            <Route path="finance/accounts" element={<AccountList />} />
            <Route path="finance/accounts/new" element={<AccountForm />} />
            <Route path="finance/accounts/:id" element={<AccountForm />} />
            <Route path="finance/journal-entries" element={<JournalEntryList />} />
            <Route path="finance/journal-entries/new" element={<JournalEntryForm />} />
            <Route path="finance/journal-entries/:id" element={<JournalEntryForm />} />
            <Route path="finance/invoices" element={<InvoiceList />} />
            <Route path="finance/invoices/new" element={<InvoiceForm />} />
            <Route path="finance/invoices/billing" element={<BillingForm />} />
            <Route path="finance/invoices/miro" element={<MiroForm />} />
            <Route path="finance/invoices/:id" element={<InvoiceForm />} />
            <Route path="finance/payments" element={<PaymentList />} />
            <Route path="finance/payments/new" element={<PaymentForm />} />
            <Route path="finance/payments/:id" element={<PaymentForm />} />
            <Route path="finance/clearing" element={<ClearingPage />} />
            <Route path="finance/reversal" element={<ReversalPage />} />
            <Route path="finance/reports" element={<FinancialReports />} />

            {/* Analytics */}
            <Route path="analytics/financial" element={<FinancialReports />} />

            {/* Fiscal */}
            <Route path="fiscal/tax-rules" element={<TaxRuleList />} />
            <Route path="fiscal/tax-rules/new" element={<TaxRuleForm />} />
            <Route path="fiscal/tax-rules/:id" element={<TaxRuleForm />} />
            <Route path="fiscal/tax-rules/:id" element={<TaxRuleForm />} />

            {/* HR */}
            <Route path="hr/employees" element={<EmployeeList />} />
            <Route path="hr/employees/new" element={<EmployeeForm />} />
            <Route path="hr/employees/:id" element={<EmployeeForm />} />

            {/* Use Profile & Settings */}
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsLayout />}>
              <Route index element={<Navigate to="users" replace />} />
              <Route path="users" element={<UserList />} />
              <Route path="company" element={<CompanySettings />} />
            </Route>

          </Route>
        </Routes>
      </SignalRProvider>
    </BrowserRouter>
  );
}

export default App;
