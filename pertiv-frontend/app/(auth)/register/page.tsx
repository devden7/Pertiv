import RegisterForm from '@/components/auth/RegisterForm';

const RegisterUser = () => {
  return (
    <section>
      <div className=" my-10">
        <h1 className="text-xl mb-3 font-bold">Register your account</h1>
        <p className="text-sm text-slate-500 mb-3">
          Create your own account, to access an amazing book page
        </p>
        <RegisterForm />
      </div>
    </section>
  );
};

export default RegisterUser;
