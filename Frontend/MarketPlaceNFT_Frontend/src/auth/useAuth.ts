// src/auth/useAuth.ts (simple hook)
export function useAuth() {
    // ví dụ kiểm tra token trong localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return { isAuthenticated: !!token };
}