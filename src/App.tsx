import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { EmployeesProvider } from "@/contexts/EmployeesContext";
import { TeamsProvider } from "@/contexts/TeamsContext";
import { ClientsProvider } from "@/contexts/ClientsContext";
import { IntegrationsProvider } from "@/contexts/IntegrationsContext";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Dashboard from "./pages/Dashboard";
import EmployeesLayout from "./components/EmployeesLayout";
import Employees from "./pages/Employees";
import EmployeeProfile from "./pages/EmployeeProfile";
import EmployeeNew from "./pages/EmployeeNew";
import EmployeeEdit from "./pages/EmployeeEdit";
import Teams from "./pages/Teams";
import TeamDetail from "./pages/TeamDetail";
import TeamNew from "./pages/TeamNew";
import TeamEdit from "./pages/TeamEdit";
import Clients from "./pages/Clients";
import ClientProfile from "./pages/ClientProfile";
import ClientNew from "./pages/ClientNew";
import ClientEdit from "./pages/ClientEdit";

import ConnectionHub from "./pages/ConnectionHub";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <EmployeesProvider>
        <TeamsProvider>
          <ClientsProvider>
            <IntegrationsProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                <Route path="/auth/reset-password" element={<ResetPassword />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route element={<EmployeesLayout />}>
                  <Route path="/employees" element={<Employees />} />
                  <Route path="/employees/new" element={<EmployeeNew />} />
                  <Route path="/employees/:id/edit" element={<EmployeeEdit />} />
                  <Route path="/employees/:id" element={<EmployeeProfile />} />
                  <Route path="/teams" element={<Teams />} />
                  <Route path="/teams/new" element={<TeamNew />} />
                  <Route path="/teams/:id" element={<TeamDetail />} />
                  <Route path="/teams/:id/edit" element={<TeamEdit />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/clients/new" element={<ClientNew />} />
                  
                  <Route path="/clients/:id" element={<ClientProfile />} />
                  <Route path="/clients/:id/edit" element={<ClientEdit />} />
                  <Route path="/connections" element={<ConnectionHub />} />
                </Route>
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
            </IntegrationsProvider>
          </ClientsProvider>
        </TeamsProvider>
      </EmployeesProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
