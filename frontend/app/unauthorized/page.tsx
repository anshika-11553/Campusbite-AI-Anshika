import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <Card className="max-w-md w-full p-8 text-center flex flex-col items-center gap-4">
        <div className="p-4 bg-red-100 rounded-full text-red-600">
          <ShieldAlert className="h-10 w-10" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">403 - Access Denied</h1>
        <p className="text-sm text-slate-600">
          You do not have the required permissions or role authorization to access this portal page.
        </p>
        <Link href={ROUTES.LOGIN} className="w-full mt-2">
          <Button variant="primary" className="w-full" leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back to Portal Login
          </Button>
        </Link>
      </Card>
    </div>
  );
}
