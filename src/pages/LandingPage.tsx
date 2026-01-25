import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, Users, Video, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import VideoBackground from '../components/VideoBackground';
import LoginModal from '../components/LoginModal';
import RegisterModal from '../components/RegisterModal';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, loginWithGoogle } = useAuth();
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    // Redirect if already authenticated
    React.useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 overflow-hidden">
            <VideoBackground
                videoUrl="https://assets.mixkit.co/videos/preview/mixkit-starry-night-sky-over-a-mountain-range-11009-large.mp4"
                overlayOpacity={0.7}
            />

            <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-10" role="navigation" aria-label="Main navigation">
                <div className="flex items-center gap-2">
                    <GraduationCap className="text-primary-400 w-8 h-8" aria-hidden="true" />
                    <span className="text-2xl font-bold tracking-tight text-white">EduStream AI</span>
                </div>
                <button
                    onClick={() => setShowLogin(true)}
                    className="glass-card px-6 py-2 text-sm font-medium hover:bg-white/20 transition-all cursor-pointer"
                    aria-label="Open login modal"
                >
                    Acceder
                </button>
            </nav>

            <main className="max-w-4xl text-center z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        Clases en Vivo con <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
                            Excelencia Digital
                        </span>
                    </h1>
                    <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
                        Plataforma educativa profesional con base de datos propia.
                        Gestiona tus clases, recibe notificaciones y conéctate con estudiantes y profesores.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <div className="flex flex-col gap-4 items-center justify-center">
                        <div className="flex flex-col md:flex-row gap-4 justify-center">
                            <button
                                onClick={() => setShowLogin(true)}
                                className="premium-button flex items-center justify-center gap-2 cursor-pointer"
                            >
                                Iniciar Sesión <LogIn size={20} />
                            </button>
                            <button
                                onClick={() => setShowRegister(true)}
                                className="glass-card px-8 py-3 text-white flex items-center justify-center gap-2 hover:bg-white/20 transition-all cursor-pointer"
                            >
                                Crear Cuenta <Users size={20} />
                            </button>
                        </div>
                        <div className="mt-2">
                            <GoogleLogin
                                onSuccess={async (credentialResponse) => {
                                    if (credentialResponse.credential) {
                                        try {
                                            await loginWithGoogle(credentialResponse.credential);
                                            // Navigation is handled by the useEffect
                                        } catch (error) {
                                            console.error("Google Login Failed", error);
                                        }
                                    }
                                }}
                                onError={() => {
                                    console.log('Login Failed');
                                }}
                                theme="filled_black"
                                shape="pill"
                            />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    <div className="glass-card p-6 text-left hover:scale-105 transition-transform duration-300">
                        <Video className="text-primary-400 mb-4" size={32} />
                        <h3 className="text-lg font-semibold mb-2">Clases Virtuales</h3>
                        <p className="text-sm text-white/50">Sistema completo de gestión de clases con enlaces de videollamada.</p>
                    </div>
                    <div className="glass-card p-6 text-left hover:scale-105 transition-transform duration-300">
                        <Calendar className="text-primary-400 mb-4" size={32} />
                        <h3 className="text-lg font-semibold mb-2">Calendario Integrado</h3>
                        <p className="text-sm text-white/50">Organiza tus horarios y citaciones de forma automática.</p>
                    </div>
                    <div className="glass-card p-6 text-left hover:scale-105 transition-transform duration-300">
                        <GraduationCap className="text-primary-400 mb-4" size={32} />
                        <h3 className="text-lg font-semibold mb-2">Gestión Académica</h3>
                        <p className="text-sm text-white/50">Sistema de roles y jerarquías para estudiantes, profesores y administradores.</p>
                    </div>
                </motion.div>
            </main>

            <footer className="absolute bottom-6 text-white/30 text-xs">
                © 2026 EduStream Premium Platform. All rights reserved.
            </footer>

            <LoginModal
                isOpen={showLogin}
                onClose={() => setShowLogin(false)}
                onSwitchToRegister={() => {
                    setShowLogin(false);
                    setShowRegister(true);
                }}
            />

            <RegisterModal
                isOpen={showRegister}
                onClose={() => setShowRegister(false)}
                onSwitchToLogin={() => {
                    setShowRegister(false);
                    setShowLogin(true);
                }}
            />
        </div >
    );
};

export default LandingPage;
