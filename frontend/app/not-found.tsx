import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileQuestion, Home } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <Card className="max-w-md w-full p-8 text-center flex flex-col items-center gap-4">
        <div className="p-4 bg-emerald-50 rounded-full text-[#054A36]">
          <FileQuestion className="h-10 w-10" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">404 - Page Not Found</h1>
        <p className="text-sm text-slate-600">
          The requested page or route could not be found. Please check the URL or return to login.
        </p>
        <Link href={ROUTES.LOGIN} className="w-full mt-2">
          <Button variant="primary" className="w-full" leftIcon={<Home className="h-4 w-4" />}>
            Return to Login Page
          </Button>
        </Link>
      </Card>
    </div>
  );
}
