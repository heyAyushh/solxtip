'use client';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { Header } from '../Header';
import Input from '../Input';
import { PublicKey } from '@solana/web3.js';
import ActionReady from '../ActionReady';
import { Session } from 'next-auth';
import { Card } from '@prisma/client';
import Loading from '../Loading';
import Button from '../Button';

export const ProfilePage: React.FC<{
  user?: any;
  session: Session;
  publicKey: string | null;
  card: Card | null;
}> = ({ user, session, publicKey, card }) => {
  // const { name, image } = session.user;
  const { wallet, publicKey: walletPublicKey, disconnect } = useWallet();
  const [inputPublicKey, setInputPublicKey] = useState(
    '' as unknown as PublicKey
  );
  const [dbPublicKey, setDbPublicKey] = useState(publicKey);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isEditing, setIsEditing] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState('');

  const validate = (value: string | PublicKey) => {
    try {
      value = new PublicKey(value);
      setInputPublicKey(value);
      setIsValid(true);
      setError('');
      return true;
    } catch (error) {
      setIsValid(false);
      setError('Invalid Public Key');
      return false;
    }
  };

  const handleInputSave = async () => {
    validate(inputValue)
      ? await saveAddress(inputValue as unknown as PublicKey)
      : console.log('Invalid public key');
  };

  const handleWalletSave = async () => {
    console.log('Saved Solana address:', walletPublicKey);
    if (!walletPublicKey) {
      console.log('No wallet public key');
      return;
    }

    try {
      validate(walletPublicKey)
        ? await saveAddress(walletPublicKey)
        : console.log('Invalid public key');
      disconnect();
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const handleCancel = () => {
    setInputValue('');
    setIsEditing(true);
    setIsValid(false);
    setError('');
  };

  useEffect(() => {
    if (inputValue) {
      validate(inputValue);
    } else {
      setIsValid(false);
      setError('');
    }

    if (inputValue.length >= 43) {
      setInputValue(inputValue.slice(0, 43));
    }
  }, [inputValue, walletPublicKey, error]);

  const saveAddress = async (publicKey: PublicKey) => {
    setIsLoading(true);
    const res = await fetch('/api/update/address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        publicKey: publicKey,
      }),
    });
    const data = await res.json();
    setDbPublicKey(data.publicKey);
    setIsLoading(false);
  };

  if (!dbPublicKey) {
    return (
      <div className="flex flex-col grow">
        <Header session={session} />
        <div
          className={`flex flex-col ${isLoading ? 'grow' : ''} items-center justify-center`}
        >
          {isLoading ? (
            <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="flex flex-col items-center justify-center p-4">
                <Loading />
              </div>
            </div>
          ) : (
            <div className="flex flex-col grow items-center justify-between lg:px-8">
              <div className="flex flex-col items-center justify-center p-4 md:p-2 grow w-full">
                <div className="flex text-6xl p-4 md:p-2">
                  <h1 className="flex text-6xl p-4 md:p-2 md:mt-20">
                    What&apos;s your Solana address?
                  </h1>
                </div>
                <section className="flex flex-col items-center gap-20 justify-center p-6 m-4 md:p-8 md:m-8 rounded-lg">
                  {!inputValue && (
                    <div className="flex border hover:border-gray-700 rounded">
                      <WalletMultiButton style={{ background: 'black' }} />
                    </div>
                  )}

                  {wallet && walletPublicKey && true && (
                    <div className="flex flex-col grow items-center justify-center text-white p-2 rounded">
                      Are you sure?
                      <div className="m-2 flex gap-2">
                        <Button
                          onClick={handleWalletSave}
                          loading={isLoading}
                          state="success"
                          className="p-2"
                        >
                          Submit
                        </Button>
                        <Button
                          onClick={() => {
                            setDbPublicKey(null);
                            disconnect();
                          }}
                          state="error"
                          className="p-2"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {!inputValue && !wallet && (
                    <div>
                      <h1 className="text-4xl md:text-6xl">or</h1>
                    </div>
                  )}

                  {(!wallet || !walletPublicKey) && (
                    <div className="max-w-md hover:border-gray-700 rounded-lg shadow-xl">
                      <Input
                        value={inputValue}
                        onChange={setInputValue}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        isValid={isValid}
                        error={error}
                        placeholder="Enter Solana address"
                        onSave={handleInputSave}
                        onCancel={handleCancel}
                      />
                    </div>
                  )}
                </section>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <ActionReady
      session={session}
      card={card}
      user={user}
      dbPublicKey={dbPublicKey}
    />
  );
};

export default ProfilePage;
