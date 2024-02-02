'use client';
import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '@/app/ui/login-form';

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      {/* <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32"> */}
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4  ">
        {/* <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36"> */}
        <div className="md:h-30 mb-2 flex w-full items-end justify-start rounded-md bg-blue-500 p-4 sm:h-20">
          <div className="md:w-70  sm:w-50 text-white lg:w-80">
            <AcmeLogo />
          </div>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
