import React from 'react';
import SoftDevHeader from './SoftDevHeader';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <SoftDevHeader />
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

export default PageLayout;