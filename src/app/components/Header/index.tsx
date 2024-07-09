import React, { Suspense, useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { Session } from 'next-auth';
import { PRODUCT_NAME } from '@/utils/constants';
import LoadingPage from '../LoadingPage';
// import Image from 'next/image';

export const Header: React.FC<{ session: Session }> = ({ session }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    setIsMenuOpen(false);
    setIsLoading(true);
    signOut({ redirect: true, callbackUrl: '/' });
  };

  return (
    <Suspense fallback={LoadingPage()}>
      <header className="shadow-sm relative border-b border-[#121212]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/"> {PRODUCT_NAME} </Link>
          <div className="relative">
            <>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center focus:outline-none h-8"
              >
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt="User Image"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {session?.user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </button>
              {isMenuOpen && (
                <div className="bg-black border absolute right-0 mt-2 w-48 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 hover:border-gray-700">
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </>
          </div>
        </div>
      </header>
    </Suspense>
  );
};
