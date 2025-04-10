import Link from 'next/link';
import React from 'react';

const AuthNavbar = () => {
  return (
    <header>
      <nav className="bg-blue-700">
        <div className="container px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4 text-white tracking-wide">
              <Link href="/" className="text-lg font-bold tracking-wider">
                PERTIV
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default AuthNavbar;
