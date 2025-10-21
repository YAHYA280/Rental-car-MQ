// src/app/[locale]/login/page.tsx - Black Background Design
import { setRequestLocale } from "next-intl/server";
import LoginForm from "@/components/auth/LoginForm";
import Image from "next/image";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function LoginPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Background Pattern/Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-50"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8">
          {/* Logo Section fg */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <Image
                src="/Logo.png"
                alt="MELHOR QUE NADA"
                width={200}
                height={100}
                className="mx-auto rounded"
              />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
            <p className="text-gray-400">Sign in to access the dashboard</p>
          </div>

          <LoginForm />
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            © 2024 MELHOR QUE NADA. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
