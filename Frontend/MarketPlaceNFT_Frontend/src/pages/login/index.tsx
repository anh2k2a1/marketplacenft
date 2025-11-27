import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../../styles/login/style.css'
import axios from 'axios';
import api from '../../api/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import GoogleLoginButton from '../../components/GoogleLoginButton';

const API_URL = 'http://localhost:8085/api/auth';

const LoginPage: React.FC = () => {
    const [isActive, setIsActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Login state
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Register state
    const [regUsername, setRegUsername] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regConfirmPassword, setRegConfirmPassword] = useState('');
    const [regWallet, setRegWallet] = useState(''); // Nếu bạn có ví thì thêm, không thì bỏ
    // Error states cho realtime validation
    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleRegisterClick = () => setIsActive(true);
    const handleLoginClick = () => setIsActive(false);

    const isFormValid = () => {
        return (
            regUsername.trim().length >= 3 &&
            validateEmail(regEmail) &&
            validatePassword(regPassword) === null &&
            regPassword === regConfirmPassword &&
            regPassword.length >= 8
        );
    };

    // ==================== LOGIN ====================
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!loginEmail || !loginPassword) {
            toast.error('Vui lòng nhập đầy đủ email và mật khẩu');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post(`${API_URL}/signin`, {
                email: loginEmail,
                password: loginPassword,
            });

            const { token, id, username, email, roles } = response.data;

            // Lưu token + user info
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({ id, username, email, roles }));

            toast.success('Đăng nhập thành công! Chào ' + username);

            // Redirect về trang chủ sau 1s
            setTimeout(() => {
                navigate('/'); // hoặc '/dashboard', '/marketplace' tùy bạn
            }, 1000);

        } catch (err: any) {
            const message = err.response?.data?.message || 'Email hoặc mật khẩu không đúng!';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    // ==================== VALIDATE FUNCTIONS ====================
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email.trim());
    };

    const validatePassword = (password: string): string | null => {
        if (password.length === 0) return null; // chưa nhập thì không báo lỗi
        if (password.length < 8) return 'Tối thiểu 8 ký tự';
        if (!/[A-Z]/.test(password)) return 'Thiếu chữ hoa';
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return 'Thiếu ký tự đặc biệt';
        return null;
    };

    const validateUsername = (username: string): string => {
        if (username.trim().length === 0) return '';
        if (username.trim().length < 3) return 'Tên người dùng ít nhất 3 ký tự';
        return '';
    };

    // ==================== REALTIME VALIDATION HANDLERS ====================
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setRegEmail(value);
        setErrors(prev => ({
            ...prev,
            email: value.trim() === '' ? '' : (validateEmail(value) ? '' : 'Email không hợp lệ')
        }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setRegPassword(value);
        const pwdError = validatePassword(value);
        setErrors(prev => ({
            ...prev,
            password: pwdError ? pwdError : ''
        }));
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setRegConfirmPassword(value);
        setErrors(prev => ({
            ...prev,
            confirmPassword: value && regPassword && value !== regPassword ? 'Mật khẩu không khớp' : ''
        }));
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setRegUsername(value);
        setErrors(prev => ({
            ...prev,
            username: validateUsername(value)
        }));
    };

    // ==================== REGISTER HANDLER (ĐÃ ĐƯỢC CẬP NHẬT) ====================
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate email
        if (!validateEmail(regEmail)) {
            toast.error('Email không hợp lệ! Vui lòng nhập đúng định dạng (ví dụ: abc@company.com)');
            return;
        }

        // Validate password
        const passwordError = validatePassword(regPassword);
        if (passwordError) {
            toast.error(passwordError);
            return;
        }

        // Validate confirm password
        if (regPassword !== regConfirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp!');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/signup`, {
                username: regUsername.trim(),
                email: regEmail.trim(),
                passwordHash: regPassword,
                ...(regWallet.trim() !== '' && { walletAddress: regWallet.trim() }),
            });

            toast.success(response.data.message || 'Đăng ký thành công! Vui lòng đăng nhập');

            // Tự động chuyển về form login
            setIsActive(false);

            // Reset form
            setRegUsername('');
            setRegEmail('');
            setRegPassword('');
            setRegConfirmPassword('');
            setRegWallet('');

        } catch (err: any) {
            const message = err.response?.data?.message || 'Đăng ký thất bại! Vui lòng thử lại.';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <div className={`login-container ${isActive ? 'active' : ''}`}>

                {/* ==================== LOGIN FORM ==================== */}
                <div className="form-box login">
                    <form onSubmit={handleLogin}>
                        <h1>Login</h1>
                        <div className="input-box">
                            <input
                                type="email"
                                placeholder="Email"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                required
                            />
                            <i className="fa-solid fa-envelope"></i>
                        </div>
                        <div className="input-box">
                            <input
                                type="password"
                                placeholder="Password"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                required
                            />
                            <i className="fa-solid fa-lock"></i>
                        </div>
                        <div className="forget-link">
                            <a href="#">Forgot password?</a>
                        </div>
                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? 'Đang đăng nhập...' : 'Login'}
                        </button>

                        <div className="social-divider"><span>OR</span></div>
                        <GoogleLoginButton />
                    </form>
                </div>

                {/* ==================== REGISTER FORM ==================== */}
                <div className="form-box register">
                    <form onSubmit={handleRegister}>
                        <h1>Register</h1>

                        {/* Username */}
                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="Username"
                                value={regUsername}
                                onChange={handleUsernameChange}
                                className={errors.username ? 'error' : regUsername.trim().length >= 3 ? 'success' : ''}
                                required
                            />
                            <i className="fa-solid fa-user"></i>
                            {errors.username && <span className="error-text">{errors.username}</span>}
                        </div>

                        {/* Email */}
                        <div className="input-box">
                            <input
                                type="email"
                                placeholder="Email"
                                value={regEmail}
                                onChange={handleEmailChange}
                                className={errors.email ? 'error' : (regEmail && validateEmail(regEmail)) ? 'success' : ''}
                                required
                            />
                            <i className="fa-solid fa-envelope"></i>
                            {errors.email && <span className="error-text">{errors.email}</span>}
                        </div>

                        {/* Wallet (tùy chọn - không validate) */}
                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="Wallet Address (tùy chọn)"
                                value={regWallet}
                                onChange={(e) => setRegWallet(e.target.value)}
                            />
                            <i className="fa-solid fa-wallet"></i>
                        </div>

                        {/* Password */}
                        <div className="input-box">
                            <input
                                type="password"
                                placeholder="Password"
                                value={regPassword}
                                onChange={handlePasswordChange}
                                className={errors.password ? 'error' : (regPassword && validatePassword(regPassword) === null && regPassword.length >= 8) ? 'success' : ''}
                                required
                            />
                            <i className="fa-solid fa-lock"></i>
                            {errors.password && <span className="error-text">{errors.password}</span>}
                        </div>

                        {/* Confirm Password */}
                        <div className="input-box">
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={regConfirmPassword}
                                onChange={handleConfirmPasswordChange}
                                className={errors.confirmPassword ? 'error' : (regConfirmPassword && regPassword && regPassword === regConfirmPassword) ? 'success' : ''}
                                required
                            />
                            <i className="fa-solid fa-lock"></i>
                            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                        </div>

                        {/* Nút Register chỉ bật khi form hợp lệ */}
                        <button
                            type="submit"
                            className="login-btn"
                            disabled={loading || !isFormValid()}
                            style={{ opacity: isFormValid() ? 1 : 0.6 }}
                        >
                            {loading ? 'Đang đăng ký...' : 'Register'}
                        </button>
                    </form>
                </div>

                {/* ==================== TOGGLE PANELS ==================== */}
                <div className="toggle-box">
                    <div className="toggle-panel toggle-left">
                        <h1>Hello, welcome!</h1>
                        <p>Don't have an account? Sign up now!</p>
                        <button className="login-btn register-btn" onClick={handleRegisterClick}>
                            Sign Up
                        </button>
                        <div className="back-to-home left">
                            <Link to="/home" className="back-link">
                                ← Back to home
                            </Link>
                        </div>
                    </div>

                    <div className="toggle-panel toggle-right">
                        <h1>Welcome Back!</h1>
                        <p>Already have an account? Sign in now!</p>
                        <button className="login-btn login-btn" onClick={handleLoginClick}>
                            Login
                        </button>
                        <div className="back-to-home right">
                            <Link to="/home" className="back-link">
                                ← Back to home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;