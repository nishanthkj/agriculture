'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function LoginRequired() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-xl border rounded-2xl">
        <CardContent className="p-6 space-y-6 text-center">
          <h2 className="text-2xl font-bold">Authentication Required</h2>
          <p className="text-muted-foreground">
            To manage your stock and workers, please login to your account.
          </p>
          <Button onClick={() => router.push('/login')} className="w-full">
            Go to Login Page
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
