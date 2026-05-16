import React from "react";
import { Link } from "react-router-dom";
import { PageWrapper } from "../components/layout/PageWrapper";
import { ShieldAlert } from "lucide-react";
import { Button } from "../components/ui/Button";

export const UnauthorizedPage = () => {
  return (
    <PageWrapper>
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(244,63,94,0.3)]">
          <ShieldAlert className="w-10 h-10 text-rose-500" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text)] mb-3">
          Access Denied
        </h1>
        <p className="text-lg text-[var(--text-muted)] max-w-md mb-8">
          You do not have the required permissions to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <Link to="/dashboard">
          <Button variant="primary" size="lg" className="shadow-[0_4px_14px_rgba(20,184,166,0.3)]">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </PageWrapper>
  );
};
