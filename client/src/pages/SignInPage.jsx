import React from "react";
import { Navigate } from "react-router-dom";
import { useContext,useState } from "react";
import axios from "axios";
import {UserContext} from "../components/UserContext.jsx"
export default function SignInPage() {
    const [activeItem, setActiveItem] = useState("Login");
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const {setUser} = useContext(UserContext);
    const [acceptTerms, setAcceptTerms] = useState(false);
    async function handleLoginSubmit(ev) {
        ev.preventDefault();
        try{
            const {data} = await axios.post('/api/login', {
                email,
                password,
            },);
            setUser(data);
            alert ('login successful');
            setRedirect(true);
        } catch (e){
            alert('Login failed')
        }
    }

    async function handleSignupSubmit(ev) {
        ev.preventDefault();
        if (!acceptTerms) {
            alert('Vui lòng đồng ý với điều khoản và điều kiện');
            return;
        }
        try {
            await axios.post('/api/register', {
                name,
                email,
                password,
            });
            alert('Registration successful. Now you can log in')
        } catch (e) {
            alert('Registration failed. Please try again later')
        }
    }

    const handleFormSwitch = () => {
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setAcceptTerms(false); 
        setActiveItem(activeItem === "Login" ? "Signup" : "Login");
    };
    if (redirect){
        return <Navigate to = {'/'}/>
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <form  onSubmit={activeItem === "Login" ? handleLoginSubmit : handleSignupSubmit} 
             className="w-full max-w-md mx-auto flex flex-col space-y-4 rounded-2xl bg-white border border-gray-400 p-6 shadow-md">
                <div className="relative h-8 rounded-full bg-gray-200 cursor-pointer overflow-hidden">
                    <div
                        className="absolute inset-0 flex items-center justify-between px-2 z-10"
                        onClick={handleFormSwitch}
                    >
                        <span className={`w-1/2 text-center transition-colors duration-300 ${activeItem === "Login" ? 'text-white' : 'text-gray-500'}`}>
                            Đăng nhập
                        </span>
                        <span className={`w-1/2 text-center transition-colors duration-300 ${activeItem === "Signup" ? 'text-white' : 'text-gray-500'}`}>
                            Đăng ký 
                        </span>
                    </div>
                    <div
                        className={`absolute top-0 h-full w-1/2 bg-blue-600 rounded-full transition-transform duration-300 transform ${
                            activeItem === "Signup" ? 'translate-x-full' : 'translate-x-0'
                        }`}
                    />
                </div>

                <div className="flex flex-col space-y-4">
                    {activeItem === "Login" ? (
                        <LoginForm
                            email={email}
                            password={password}
                            setEmail={setEmail}
                            setPassword={setPassword}
                    />
                    ) : (
                        <SignupForm
                            name={name}
                            email={email}
                            password={password}
                            confirmPassword={confirmPassword}
                            acceptTerms={acceptTerms}
                            setName={setName}
                            setEmail={setEmail}
                            setPassword={setPassword}
                            setConfirmPassword={setConfirmPassword}
                            setAcceptTerms={setAcceptTerms}
                    />
                    )}
                    <div className="flex justify-center mt-4">
                        <button 
                            type="submit" 
                            className="w-full bg-blue-600 text-white rounded-2xl px-6 py-3 flex items-center justify-between hover:bg-blue-700 transition-colors"
                        >
                            <span className="flex-1 text-center">Tiếp tục</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

function LoginForm({ email, password, setEmail, setPassword }) {
    return (
        <>
            <input 
                type="email"
                placeholder="your@email.address"
                value={email}
                onChange={ev => setEmail(ev.target.value)}
                className="w-full p-2 rounded-lg border border-gray-400"
            />
            <input
                type="password"
                placeholder="password"
                value={password}
                onChange={ev => setPassword(ev.target.value)}
                className="w-full p-2 rounded-lg border border-gray-400"
            />
            <div className="flex justify-end">
                <button type="button">
                    <a href="/forgotpassword" className="underline text-blue-600">Quên mật khẩu ?</a>
                </button>
            </div>
        </>
    );
}

function SignupForm({ 
    name, 
    email, 
    password, 
    confirmPassword, 
    acceptTerms,
    setName, 
    setEmail, 
    setPassword, 
    setConfirmPassword,
    setAcceptTerms 
}) {
    return (
        <>
            <input 
                type="text"
                placeholder="Full name" 
                value={name} 
                onChange={ev => setName(ev.target.value)}
                className="w-full p-2 rounded-lg border border-gray-400"
            />
            <input 
                type="email"
                placeholder="your@email.address"
                value={email}
                onChange={ev => setEmail(ev.target.value)}
                className="w-full p-2 rounded-lg border border-gray-400"
            />
            <input
                type="password"
                placeholder="Create password"
                value={password}
                onChange={ev => setPassword(ev.target.value)}
                className="w-full p-2 rounded-lg border border-gray-400"
            />
            <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={ev => setConfirmPassword(ev.target.value)}
                className="w-full p-2 rounded-lg border border-gray-400"
            />
            <div className="flex items-start space-x-2">
                <input
                    type="checkbox"
                    id="terms"
                    checked={acceptTerms}
                    onChange={ev => setAcceptTerms(ev.target.checked)}
                    className="mt-1"
                    required
                />
                <div className="text-sm text-gray-600">
                    Tôi đồng ý với {' '}
                    <span className="text-blue-600 hover:underline cursor-pointer">
                        Điều khoản và Điều kiện
                    </span>
                </div>
            </div>
        </>
    );
}