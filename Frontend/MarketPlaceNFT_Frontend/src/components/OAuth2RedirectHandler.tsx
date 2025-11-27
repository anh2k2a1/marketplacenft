import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const OAuth2RedirectHandler: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const processed = React.useRef(false);

    useEffect(() => {
        if (processed.current) return;
        processed.current = true;

        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const error = params.get('error');

        if (token) {
            // Save token to localStorage
            localStorage.setItem('token', token);

            // Decode JWT to get user info (optional)
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(
                    atob(base64)
                        .split('')
                        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                        .join('')
                );
                const payload = JSON.parse(jsonPayload);

                // Save user info
                localStorage.setItem('user', JSON.stringify({
                    email: payload.sub,
                    username: payload.sub,
                }));

                toast.success('Đăng nhập Google thành công!');

                // Redirect to home
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            } catch (err) {
                console.error('Error decoding token:', err);
                toast.success('Đăng nhập thành công!');
                navigate('/');
            }
        } else if (error) {
            toast.error(`Đăng nhập thất bại: ${error}`);
            navigate('/login');
        } else {
            toast.error('Không nhận được token từ server');
            navigate('/login');
        }
    }, [location, navigate]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column',
            gap: '20px'
        }}>
            <div className="spinner"></div>
            <p>Đang xử lý đăng nhập...</p>
        </div>
    );
};

export default OAuth2RedirectHandler;
