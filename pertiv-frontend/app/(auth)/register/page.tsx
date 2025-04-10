import RegisterForm from '@/components/auth/RegisterForm';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

const RegisterUser = () => {
  return (
    <section>
      <Card className="p-5">
        <h1 className="text-xl mb-3 font-bold">Register your account</h1>
        <p className="text-sm text-slate-500 mb-3">
          Create your own account, to access an amazing book page
        </p>
        <RegisterForm />
        <div className="mt-3">
          <p className="text-sm text-slate-500">
            Have an account? login{' '}
            <Link
              href="/login"
              className="text-primary-500 font-medium cursor-pointer"
            >
              here
            </Link>
          </p>
        </div>
      </Card>
    </section>
  );
};

export default RegisterUser;
