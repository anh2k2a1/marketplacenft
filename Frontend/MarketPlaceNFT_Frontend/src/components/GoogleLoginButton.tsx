import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const GOOGLE_CLIENT_ID = '801067373972-217crc3k8ihg39ksbp0t08lituifvq2u.apps.googleusercontent.com';
const BACKEND_URL = 'http://localhost:8085';

interface GoogleLoginButtonProps {
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onSuccess, onError }) => {
    const navigate = useNavigate();

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            // Redirect to backend OAuth2 endpoint
            window.location.href = `${BACKEND_URL}/oauth2/authorization/google`;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Đăng nhập Google thất bại!';
            toast.error(errorMessage);
            onError?.(errorMessage);
        }
    };

    const handleGoogleError = () => {
        const errorMessage = 'Đăng nhập Google thất bại!';
        toast.error(errorMessage);
        onError?.(errorMessage);
    };

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <div className="google-login-wrapper">
                <button
                    type="button"
                    className="login-btn google-btn"
                    onClick={() => window.location.href = `${BACKEND_URL}/oauth2/authorization/google`}
                >
                    <img 
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                        alt="Google" 
                    />
                    <span>Sign in with Google</span>
                </button>
            </div>
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginButton;
