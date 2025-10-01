'use client';

import { Toaster } from 'sonner';

export function ToastProvider() {
  return (
    <Toaster
      theme="dark"
      position="top-right"
      toastOptions={{
        style: {
          background: 'var(--gray-15)',
          border: '1px solid var(--gray-20)',
          color: 'var(--white-99)',
        },
        className: 'sonner-toast',
      }}
      className="toaster-custom"
    />
  );
}
