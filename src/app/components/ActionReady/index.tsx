'use client';
import React, { Suspense } from 'react';
import { Session } from 'next-auth';
import { Card, User } from '@prisma/client';
import { Header } from '../Header';
import GradientText from '../GradientText';
import Button from '../Button';
import { FaXTwitter } from 'react-icons/fa6';
import DialectLogo from '../DialectLogo';
import { useRouter } from 'next/navigation';
import Loading from '../Loading';
import LoadingPage from '../LoadingPage';
import { BASE_URL } from '@/utils/constants';

interface ActionReadyProps {
  session: Session;
  dbPublicKey: string;
  card: Card | null;
  user: User;
}

const ActionReady: React.FC<ActionReadyProps> = ({
  session,
  dbPublicKey,
  user,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const dialUrl = `https://dial.to/devnet?action=solana-action:${BASE_URL}/actions/tip/${user.username}`;

  const handleShareTweetIntent = async () => {
    const url = `https://twitter.com/intent/tweet?text=Buy me a coffee ☕️ with @solana blinks ⚡️${dialUrl}`;
    window.open(encodeURI(url), '_blank');
  };

  const handleCheckoutBlinkIntent = async () => {
    window.open(dialUrl, '_blank');
  };

  const resetAddress = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/update/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          publicKey: null,
        }),
      });

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('An error occurred, please try again later.');
    }
  };

  return (
    <Suspense fallback={<LoadingPage />}>
      <div className="flex flex-col bg-black grow">
        <Header session={session} />
        {isLoading ? (
          <div className="flex grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col items-center justify-center p-4">
              <Loading />
            </div>
          </div>
        ) : (
          <div className="flex grow flex-col items-center justify-center p-6">
            <div className="flex grow text-center items-center">
              <h1 className="text-4xl md:text-6xl font-bold text-center">
                <GradientText text="You're ready to collect payments" />
                🎉
              </h1>
            </div>
            <div className="flex grow flex-col items-center justify-center md:w-2/3 max-w-md space-y-4">
              <p className="text text-center">Your Solana Address is</p>
              <div className="flex border border-gray-700 text-gray-600 text-2xl items-center justify-center p-4 rounded-lg">
                {dbPublicKey.slice(0, 6)}...{dbPublicKey.slice(-6)}
              </div>
            </div>
            <div className="flex grow flex-col items-center md:w-2/3 max-w-md space-y-6">
              <Button
                onClick={handleShareTweetIntent}
                disabled={isLoading}
                className="w-full py-3 px-4 text-md flex items-center justify-center space-x-2"
              >
                <span>Share Blink </span>
                <FaXTwitter className="inline-block" />
              </Button>
              <Button
                onClick={handleCheckoutBlinkIntent}
                disabled={isLoading}
                className="w-full py-3 px-4 text-md flex items-center justify-center space-x-2"
              >
                <span>Check Blink </span>
                <DialectLogo className="inline-block" w={60} h={15} />
              </Button>
              <Button
                onClick={() => resetAddress()}
                disabled={isLoading}
                loading={isLoading}
                className="w-full py-3 px-4 text-md flex items-center justify-center space-x-2"
                state="error"
              >
                <span>Reset Solana Address</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </Suspense>
  );
};

export default ActionReady;
