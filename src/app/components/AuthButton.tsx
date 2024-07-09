'use client';
import { useSession, signIn, signOut } from 'next-auth/react';
import Button from './Button';
import { FaXTwitter } from 'react-icons/fa6';
import { useState } from 'react';
import Loading from './Loading';

const AuthButton = () => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  if (status === 'loading') return <Loading />;

  const handleLogin = () => {
    setIsLoading(true);
    signIn('twitter', { redirect: false, callbackUrl: '/profile' });
  };

  if (session) {
    return <Button onClick={() => signOut()} className='p-2'>Logout</Button>;
  } else {
    return (
      <div className="w-28">
        <Button onClick={handleLogin} loading={isLoading} className="p-2">
          Login with <FaXTwitter className="inline-block ml-2" />
        </Button>
      </div>
    );
  }
};

export default AuthButton;
