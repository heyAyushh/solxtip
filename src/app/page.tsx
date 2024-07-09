import React from 'react';
import { useSession } from 'next-auth/react';
import { FaXTwitter } from 'react-icons/fa6';
import Image from 'next/image';
import AuthButton from './components/AuthButton';
import { redirect, useRouter } from 'next/navigation';
import { auth } from '@/utils/auth';

export default async function HomePage() {
  const session = await auth();

  if (session) {
    redirect('/profile');
  }

  return (
    <div className="flex flex-col grow items-center justify-center bg-black text-white p-4">
      <div className="text-center mb-8 max-w-md">
        <h1 className="text-4xl font-bold mb-4">
          Collect tips from{' '}
          <FaXTwitter className="inline-block text-4xl mx-1" />{' '}
          using{' '}
          <Image
            src="/solana.svg"
            alt="Solana"
            width={24}
            height={24}
            className="inline-block mx-1"
          />
          {' '}Blinks
        </h1>
        <p className="text-lg text-gray-400 mb-8">
          Connect your Twitter account and start receiving tips in your Solana Wallet
        </p>
      </div>

      <div className="flex flex-col items-center">
        <AuthButton />
      </div>
    </div>
  );
}
