import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EmailVerification() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifying your email...');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/verify/${userId}`);
        const data = await response.json();

        if (response.ok) {
          setMessage(data.message || 'Email verified successfully!');
          setIsError(false);
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          setMessage(data.message || 'Email verification failed.');
          setIsError(true);
        }
      } catch (error) {
        setMessage('An error occurred during verification.');
        setIsError(true);
        console.error('Verification error:', error);
      }
    };

    verifyEmail();
  }, [userId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <h2 className="mt-6 text-center text-3xl font-heading font-bold text-text">
          Email Verification
        </h2>
        <p className={`mt-2 text-center text-lg ${isError ? 'text-error' : 'text-success'}`}>
          {message}
        </p>
        {!isError && (
          <p className="text-center text-sm text-text/60">
            You will be redirected to the login page shortly.
          </p>
        )}
      </div>
    </div>
  );
}

export default EmailVerification; 