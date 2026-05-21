'use client';

import { type FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        router.push('/');
        return;
      }

      setError('Invalid password. Please try again.');
    } catch (err) {
      setError('Unable to validate the password right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-soarx-navy text-soarx-silver flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-3xl border border-soarx-silver/20 bg-soarx-deep-gray/90 p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="text-3xl font-bold text-white mb-4">SoarX Secure Access</h1>
        <p className="mb-6 text-sm text-soarx-silver/70">
          Enter the access password to continue to the SoarX Intelligence frontend.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-soarx-silver">
            Access Password
          </label>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="input-field w-full"
            placeholder="Enter password"
            disabled={isSubmitting}
          />

          {error ? <p className="text-sm text-soarx-orange">{error}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting || !password.trim()}
            className="button-primary w-full"
          >
            {isSubmitting ? 'Checking...' : 'Unlock SoarX'}
          </button>
        </form>
      </div>
    </div>
  );
}
