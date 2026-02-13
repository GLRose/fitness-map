import { SignUpForm } from '@/components/login/SignupForm';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#044447]">
      <div className="w-full max-w-md">
        <SignUpForm />
      </div>
    </div>
  );
}
