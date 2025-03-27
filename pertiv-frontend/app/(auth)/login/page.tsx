import AuthForm from '@/components/auth/AuthForm';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

const Login = () => {
  return (
    <section>
      <Card className="p-5">
        <h1 className="text-xl mb-3 font-bold">Welcome back!</h1>
        <p className="text-sm text-slate-500 mb-3">
          You can login into your account first, to read many or buy an
          intersting book
        </p>
        <AuthForm />
        <div className="mt-3">
          <p className="text-sm text-slate-500">
            Dont have an account?
            <Link
              href="/register"
              className="text-primary-500 font-medium cursor-pointer"
            >
              {' '}
              Register here
            </Link>
          </p>
        </div>
      </Card>
    </section>
  );
};

export default Login;
