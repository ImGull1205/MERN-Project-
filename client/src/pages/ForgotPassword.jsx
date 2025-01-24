import React, { useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

export default function ResetPasswordPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [redirect, setRedirect] = useState(false);

    async function handleSubmit(ev) {
        ev.preventDefault();
        if (password !== confirmPassword) {
            alert('Mật khẩu không khớp');
            return;
        }
        try {
            await axios.post('/api/reset-password', {
                email,
                password,
            });
            alert('Đặt lại mật khẩu thành công');
            setRedirect(true);
        } catch (e) {
            alert('Đặt lại mật khẩu thất bại. Vui lòng thử lại sau');
        }
    }

    if (redirect) {
        return <Navigate to={'/login'} />
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} 
                  className="w-full max-w-md mx-auto flex flex-col space-y-4 rounded-2xl bg-white border border-gray-400 p-6 shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    Đặt lại mật khẩu
                </h2>

                <div className="flex flex-col space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={ev => setEmail(ev.target.value)}
                        placeholder="your@email.address"
                        className="w-full p-2 rounded-lg border border-gray-400"
                        required
                    />
                    
                    <input
                        type="password"
                        value={password}
                        onChange={ev => setPassword(ev.target.value)}
                        placeholder="Mật khẩu mới"
                        className="w-full p-2 rounded-lg border border-gray-400"
                        required
                    />
                    
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={ev => setConfirmPassword(ev.target.value)}
                        placeholder="Xác nhận mật khẩu"
                        className="w-full p-2 rounded-lg border border-gray-400"
                        required
                    />

                    

                    <div className="flex justify-center mt-4">
                        <button 
                            type="submit" 
                            className="w-full bg-blue-600 text-white rounded-2xl px-6 py-3 flex items-center justify-between hover:bg-blue-700 transition-colors"
                        >
                            <span className="flex-1 text-center">Đặt lại mật khẩu</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </button>
                    </div>

                    <div className="text-center">
                        <a href="/login" className="text-blue-600 hover:underline text-sm">
                            Quay lại đăng nhập
                        </a>
                    </div>
                </div>
            </form>
        </div>
    );
}