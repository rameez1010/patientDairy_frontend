import { useEffect, useState } from 'react';

import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';

import doctorApiService from '../../services/doctorApiService';

const REDIRECT_URI = 'http://localhost:3000/fullscript/callback';

const FullscriptCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = doctorApiService.getAccessToken();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');

      if (!code) {
        toast.error('No authorization code received from Fullscript');
        navigate('/settings');
        return;
      }

      try {
        // Updated API endpoint to match your backend route
        const response = await fetch(`${apiUrl}/fullscript/access-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            code,
            redirect_uri: REDIRECT_URI,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error_description || 'Failed to exchange code for token');
        }

        const data = await response.json();

        // Store the Fullscript access token and refresh token
        localStorage.setItem('fullscriptToken', data.access_token);
        localStorage.setItem('fullscriptRefreshToken', data.refresh_token);

        toast.success('Successfully connected to Fullscript!');
        navigate('/settings');
      } catch (error) {
        console.error('Error exchanging code for token:', error);
        toast.error(error.message || 'Failed to connect to Fullscript');
        navigate('/settings');
      } finally {
        setIsLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate, apiUrl, token]);

  return (
    <div className="h-screen bg-white w-full flex items-center justify-center">
      <Toaster position="top-center" />
      {isLoading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5558E4] mx-auto"></div>
          <p className="mt-4 text-gray-600">Connecting to Fullscript...</p>
        </div>
      ) : null}
    </div>
  );
};

export default FullscriptCallback;
