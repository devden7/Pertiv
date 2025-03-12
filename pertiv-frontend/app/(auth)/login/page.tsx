import AuthForm from '@/components/auth/AuthForm';

const Login = () => {
  return (
    <section>
      <div className=" my-10">
        <h1 className="text-xl mb-3 font-bold">Welcome back!</h1>
        <p className="text-sm text-slate-500 mb-3">
          You can login into your account first, to read many or buy an
          intersting book
        </p>
        <AuthForm />
      </div>
    </section>
  );
};

export default Login;
