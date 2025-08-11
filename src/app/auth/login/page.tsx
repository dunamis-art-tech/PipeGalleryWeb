import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  // Simple static login page without auth provider dependency  
  return (
    <div className="min-h-screen bg-gray-50">
      <LoginForm />
    </div>
  );
}