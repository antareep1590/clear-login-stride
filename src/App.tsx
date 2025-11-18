import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { EmployeesProvider } from "@/contexts/EmployeesContext";
import { TeamsProvider } from "@/contexts/TeamsContext";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <EmployeesProvider>
        <TeamsProvider>
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
                </Route>
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </TeamsProvider>
      </EmployeesProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
