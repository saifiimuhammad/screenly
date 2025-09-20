import { lazy } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";

import { queryClient } from "./lib/queryClient";
import { ToastProvider } from "./components/providers/ToastProvider";

import Home from "@/pages/home";

const NotFound = lazy(() => import("@/pages/not-found"));

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <TooltipProvider> */}
      <ToastProvider>
        <div className="min-h-screen gradient-bg">
          {/* <Toaster /> */}
          <Router />
        </div>
      </ToastProvider>
      {/* </TooltipProvider> */}
    </QueryClientProvider>
  );
}

export default App;
