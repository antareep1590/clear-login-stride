import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">Welcome to Smoothire</h1>
        <p className="mb-8 text-xl text-muted-foreground">A minimal authentication experience</p>
        <div className="flex gap-4 justify-center">
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button size="lg">Go to Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to="/auth/login">
                <Button size="lg">Sign In</Button>
              </Link>
              <Link to="/auth/login">
                <Button size="lg" variant="outline">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
