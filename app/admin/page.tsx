'use client';

import { useState } from 'react';
import LoginPage from '@/components/LoginPage';
import AdminDashboard from '@/components/AdminDashboard';

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    if (!isAuthenticated) {
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }

    return <AdminDashboard onLogout={handleLogout} />;
}
