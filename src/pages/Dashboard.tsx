import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Calendar as CalendarIcon,
    Video,
    Mail,
    Settings,
    LogOut,
    Bell,
    Search,
    Plus,
    Clock,
    User,
    Play,
    Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { classService } from '../services/classService';
import type { Class } from '../services/classService';
import { courseService } from '../services/courseService';
import type { Course } from '../services/courseService';
import VideoBackground from '../components/VideoBackground';
import { useTheme } from '../contexts/ThemeContext';
import { authService } from '../services/authService';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout, login } = useAuth(); // Assuming login updates user state ref
    const { theme, setTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [classes, setClasses] = useState<Class[]>([]);
    const [myCourses, setMyCourses] = useState<Course[]>([]);
    const [publishedCourses, setPublishedCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Settings State
    const [selectedTimezone, setSelectedTimezone] = useState(user?.timezone || 'UTC');
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleThemeChange = async (newTheme: 'student-blue' | 'teacher-black' | 'profile-white' | 'lilac-premium') => {
        setTheme(newTheme);
        if (user) {
            try {
                await authService.updateProfile({ theme: newTheme });
                // Force reload user data or manually update context if needed (omitted for brevity)
            } catch (e) {
                console.error("Failed to save theme", e);
            }
        }
    };

    const handleAvatarChange = async (url: string) => {
        if (user) {
            try {
                await authService.updateProfile({ avatar: url });
                window.location.reload(); // Simple way to refresh user context
            } catch (e) {
                console.error("Failed to save avatar", e);
            }
        }
    };


    useEffect(() => {
        if (activeTab === 'dashboard' || activeTab === 'classes') {
            loadClasses();
        } else if (activeTab === 'courses') {
            loadCourses();
        }
    }, [activeTab]);

    const loadClasses = async () => {
        try {
            setLoading(true);
            setError(null);
            const classesData = await classService.getClasses();
            setClasses(classesData);
        } catch (err: any) {
            console.error('Error loading classes:', err);
            setError(err.response?.data?.error || 'Error al cargar las clases');
        } finally {
            setLoading(false);
        }
    };

    const loadCourses = async () => {
        try {
            setLoading(true);
            setError(null);
            const [myCoursesData, publishedCoursesData] = await Promise.all([
                courseService.getMyCourses(),
                courseService.getPublishedCourses()
            ]);
            setMyCourses(myCoursesData);
            setPublishedCourses(publishedCoursesData);
        } catch (err: any) {
            console.error('Error loading courses:', err);
            setError(err.response?.data?.error || 'Error al cargar los cursos');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleJoinMeet = (url?: string) => {
        const meetUrl = url || 'https://meet.google.com/new';
        window.open(meetUrl, '_blank');
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
    };

    const getGreeting = () => {
        if (!user) return 'Bienvenido';
        const roleLabels: Record<string, string> = {
            STUDENT: 'Estudiante',
            TEACHER: 'Profesor',
            ADMIN: 'Administrador'
        };
        return `Bienvenido, ${user.name} (${roleLabels[user.role]})`;
    };

    const getLiveClasses = () => {
        return classes.filter(cls => cls.status === 'LIVE');
    };

    const getUpcomingClasses = () => {
        const now = new Date();
        return classes
            .filter(cls => new Date(cls.startTime) > now && cls.status === 'SCHEDULED')
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
            .slice(0, 5);
    };

    const filteredClasses = classes.filter(cls =>
        cls.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.teacher.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[var(--bg-app)] text-white flex overflow-hidden transition-colors duration-500">
            <VideoBackground
                videoUrl="https://assets.mixkit.co/videos/preview/mixkit-flying-through-the-clouds-in-a-sunny-sky-34444-large.mp4"
                overlayOpacity={0.85}
            />

            {/* Sidebar */}
            <aside className="w-64 glass-card border-r border-white/10 m-4 rounded-3xl flex flex-col p-6 z-10">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="bg-primary-500 p-2 rounded-xl">
                        <LayoutDashboard size={24} />
                    </div>
                    <span className="font-bold text-xl">EduStream</span>
                </div>

                <nav className="flex-1 space-y-2">
                    {[
                        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                        { id: 'calendar', icon: CalendarIcon, label: 'Calendario' },
                        { id: 'classes', icon: Video, label: 'Mis Clases' },
                        { id: 'courses', icon: Play, label: 'Cursos Udemy' }, // New Tab
                        { id: 'messages', icon: Mail, label: 'Mensajes' },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${activeTab === item.id
                                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                                : 'text-white/50 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="mt-auto space-y-2 border-t border-white/10 pt-6">
                    <button
                        onClick={() => setActiveTab('settings')}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:bg-white/5 hover:text-white transition-all cursor-pointer"
                    >
                        <Settings size={20} />
                        <span className="font-medium">Ajustes</span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all cursor-pointer"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Salir</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col p-8 overflow-y-auto z-10">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold mb-1">
                            {activeTab === 'dashboard' && getGreeting()}
                            {activeTab === 'calendar' && 'Mi Calendario Escolar'}
                            {activeTab === 'classes' && 'Mis Clases Virtuales'}
                            {activeTab === 'messages' && 'Bandeja de Entrada'}
                            {activeTab === 'settings' && 'Configuración'}
                        </h1>
                        <p className="text-white/50 text-sm">
                            {activeTab === 'dashboard' && 'Aquí tienes el resumen de tus clases de hoy.'}
                            {activeTab === 'calendar' && 'Organiza tus horarios y entregas.'}
                            {activeTab === 'classes' && 'Accede a tus clases grabadas y en vivo.'}
                            {activeTab === 'messages' && 'Mantente al día con tus avisos y citaciones.'}
                            {activeTab === 'settings' && 'Gestiona tu cuenta y preferencias.'}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
                            />
                        </div>
                        <button
                            onClick={() => setActiveTab('messages')}
                            className="glass-card p-2 relative cursor-pointer"
                        >
                            <Bell size={20} />
                        </button>
                        <div
                            onClick={() => setActiveTab('settings')}
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-indigo-600 border-2 border-white/20 cursor-pointer hover:scale-110 transition-transform flex items-center justify-center text-white font-bold"
                            title={user?.name}
                        >
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                    </div>
                </header>

                {loading && activeTab === 'dashboard' && (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-white/50">Cargando clases...</div>
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
                        {error}
                    </div>
                )}

                {!loading && activeTab === 'dashboard' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            {/* Featured Live Class */}
                            {getLiveClasses().length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass-card p-8 bg-gradient-to-br from-primary-600/40 to-indigo-600/40 border-primary-500/30 overflow-hidden relative"
                                >
                                    <div className="relative z-10">
                                        <span className="inline-block px-3 py-1 bg-red-500 text-xs font-bold rounded-full mb-4 animate-pulse">
                                            EN VIVO
                                        </span>
                                        <h2 className="text-4xl font-bold mb-2">{getLiveClasses()[0].title}</h2>
                                        <p className="text-lg text-white/80 mb-6">
                                            {getLiveClasses()[0].teacher.name} {getLiveClasses()[0].room && `- ${getLiveClasses()[0].room}`}
                                        </p>
                                        <button
                                            onClick={() => handleJoinMeet(getLiveClasses()[0].meetUrl)}
                                            className="premium-button flex items-center gap-2 cursor-pointer"
                                        >
                                            <Video size={20} /> Unirse a la Clase
                                        </button>
                                    </div>
                                    <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl"></div>
                                </motion.div>
                            )}

                            {/* Upcoming Classes */}
                            <section>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold">Próximas Clases</h3>
                                    <button
                                        onClick={() => setActiveTab('classes')}
                                        className="text-primary-400 text-sm font-medium hover:underline cursor-pointer"
                                    >
                                        Ver todo
                                    </button>
                                </div>
                                {getUpcomingClasses().length > 0 ? (
                                    <div className="space-y-4">
                                        {getUpcomingClasses().map((cls) => (
                                            <motion.div
                                                key={cls.id}
                                                whileHover={{ x: 10 }}
                                                className="glass-card p-4 flex items-center justify-between hover:bg-white/15 transition-all cursor-pointer"
                                                onClick={() => setActiveTab('classes')}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary-400 font-bold">
                                                        {formatTime(cls.startTime).split(':')[0]}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold">{cls.title}</h4>
                                                        <p className="text-xs text-white/40">
                                                            {cls.teacher.name} • {formatTime(cls.startTime)} • {formatDate(cls.startTime)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (cls.meetUrl) handleJoinMeet(cls.meetUrl);
                                                    }}
                                                    className="p-2 text-white/30 hover:text-white transition-colors"
                                                >
                                                    <Plus size={20} />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="glass-card p-8 text-center text-white/50">
                                        No hay clases programadas próximamente
                                    </div>
                                )}
                            </section>
                        </div>

                        <div className="space-y-8">
                            {/* Calendar Widget */}
                            <section className="glass-card p-6">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <CalendarIcon size={18} className="text-primary-400" /> Mi Calendario
                                </h3>
                                <div className="grid grid-cols-7 gap-1 text-center text-xs text-white/30 mb-2">
                                    <span>L</span><span>M</span><span>X</span><span>J</span><span>V</span><span>S</span><span>D</span>
                                </div>
                                <div className="grid grid-cols-7 gap-1 text-center">
                                    {Array.from({ length: 31 }).map((_, i) => {
                                        const day = i + 1;
                                        const hasClass = classes.some(cls => {
                                            const classDate = new Date(cls.startTime);
                                            return classDate.getDate() === day;
                                        });
                                        return (
                                            <div
                                                key={i}
                                                className={`p-2 rounded-lg text-sm cursor-pointer ${hasClass
                                                    ? 'bg-primary-500 text-white'
                                                    : 'hover:bg-white/5'
                                                    }`}
                                            >
                                                {day}
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* User Info */}
                            <section className="glass-card p-6">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <User size={18} className="text-primary-400" /> Mi Perfil
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <p className="text-white/70">
                                        <span className="text-white font-medium">Nombre:</span> {user?.name}
                                    </p>
                                    <p className="text-white/70">
                                        <span className="text-white font-medium">Email:</span> {user?.email}
                                    </p>
                                    <p className="text-white/70">
                                        <span className="text-white font-medium">Rol:</span> {
                                            user?.role === 'STUDENT' ? 'Estudiante' :
                                                user?.role === 'TEACHER' ? 'Profesor' : 'Administrador'
                                        }
                                    </p>
                                </div>
                            </section>
                        </div>
                    </div>
                )}

                {activeTab === 'classes' && (
                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center text-white/50 py-20">Cargando clases...</div>
                        ) : error ? (
                            <div className="glass-card p-8 text-center text-red-400">
                                {error}
                            </div>
                        ) : filteredClasses.length > 0 ? (
                            filteredClasses.map((cls) => (
                                <motion.div
                                    key={cls.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass-card p-6 hover:bg-white/15 transition-all"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-bold">{cls.title}</h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${cls.status === 'LIVE' ? 'bg-red-500/20 text-red-400' :
                                                    cls.status === 'SCHEDULED' ? 'bg-blue-500/20 text-blue-400' :
                                                        cls.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                                                            'bg-gray-500/20 text-gray-400'
                                                    }`}>
                                                    {cls.status === 'LIVE' ? 'EN VIVO' :
                                                        cls.status === 'SCHEDULED' ? 'PROGRAMADA' :
                                                            cls.status === 'COMPLETED' ? 'COMPLETADA' : 'CANCELADA'}
                                                </span>
                                            </div>
                                            {cls.description && (
                                                <p className="text-white/70 mb-4">{cls.description}</p>
                                            )}
                                            <div className="flex items-center gap-6 text-sm text-white/60">
                                                <div className="flex items-center gap-2">
                                                    <User size={16} />
                                                    <span>{cls.teacher.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock size={16} />
                                                    <span>{formatTime(cls.startTime)} - {formatTime(cls.endTime)}</span>
                                                </div>
                                                {cls.room && (
                                                    <div className="flex items-center gap-2">
                                                        <span>📍 {cls.room}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            {cls.meetUrl && (
                                                <button
                                                    onClick={() => handleJoinMeet(cls.meetUrl)}
                                                    className="premium-button cursor-pointer"
                                                >
                                                    <Video size={18} className="mr-2" />
                                                    Unirse
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="glass-card p-20 text-center text-white/50">
                                {searchQuery ? 'No se encontraron clases' : 'No tienes clases asignadas'}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'calendar' && (
                    <div className="glass-card p-8">
                        <h2 className="text-2xl font-bold mb-6">Vista de Calendario</h2>
                        <div className="space-y-4">
                            {classes
                                .filter(cls => cls.status === 'SCHEDULED' || cls.status === 'LIVE')
                                .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                                .map((cls) => (
                                    <div key={cls.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                                        <div className="w-16 text-center">
                                            <div className="text-2xl font-bold">{new Date(cls.startTime).getDate()}</div>
                                            <div className="text-xs text-white/50">
                                                {new Date(cls.startTime).toLocaleDateString('es-ES', { month: 'short' })}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold">{cls.title}</h3>
                                            <p className="text-sm text-white/60">
                                                {formatTime(cls.startTime)} - {cls.teacher.name}
                                            </p>
                                        </div>
                                        {cls.meetUrl && (
                                            <button
                                                onClick={() => handleJoinMeet(cls.meetUrl)}
                                                className="premium-button cursor-pointer"
                                            >
                                                Unirse
                                            </button>
                                        )}
                                    </div>
                                ))}
                            {classes.length === 0 && (
                                <div className="text-center text-white/50 py-10">
                                    No hay clases programadas
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'messages' && (
                    <div className="glass-card p-20 text-center">
                        <Mail size={48} className="text-primary-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Sistema de Mensajería</h2>
                        <p className="text-white/60">
                            Esta funcionalidad estará disponible próximamente
                        </p>
                    </div>
                )}

                {activeTab === 'courses' && (
                    <div className="space-y-12">
                        {/* My Courses Section */}
                        <section>
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Play size={24} className="text-primary-400" /> Mis Cursos
                            </h2>
                            {loading ? (
                                <div className="text-white/50">Cargando cursos...</div>
                            ) : myCourses.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {myCourses.map((course) => (
                                        <div
                                            key={course.id}
                                            className="glass-card p-0 overflow-hidden cursor-pointer hover:scale-105 transition-transform group"
                                            onClick={() => navigate(`/course/${course.id}/learn`)}
                                        >
                                            <div className="aspect-video bg-black relative">
                                                <img
                                                    src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop"}
                                                    alt={course.title}
                                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                                                    <Play size={48} className="text-white drop-shadow-lg" fill="currentColor" />
                                                </div>
                                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700">
                                                    <div
                                                        className="h-full bg-primary-500"
                                                        style={{ width: `${course.progress || 0}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-bold text-lg mb-1 truncate">{course.title}</h3>
                                                <p className="text-xs text-white/50 mb-3">{course.teacher.name}</p>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-primary-400">{course.progress || 0}% Completado</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="glass-card p-10 text-center text-white/50">
                                    No estás inscrito en ningún curso todavía.
                                </div>
                            )}
                        </section>

                        {/* Marketplace Section */}
                        <section>
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Search size={24} className="text-primary-400" /> Explorar Cursos
                            </h2>
                            {loading ? (
                                <div className="text-white/50">Cargando cursos disponibles...</div>
                            ) : publishedCourses.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {publishedCourses.map((course) => (
                                        <div
                                            key={course.id}
                                            className="glass-card p-4 hover:bg-white/10 transition-colors cursor-pointer"
                                            onClick={() => navigate(`/course/${course.id}/learn`)}
                                        >
                                            <div className="aspect-video bg-black/50 rounded-lg mb-4 overflow-hidden">
                                                <img
                                                    src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop"}
                                                    alt={course.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <h3 className="font-bold mb-1 truncate">{course.title}</h3>
                                            <p className="text-xs text-white/50 mb-2">{course.teacher.name}</p>
                                            <div className="flex justify-between items-center mt-4">
                                                <span className="font-bold text-primary-400">
                                                    {course.price === 0 ? 'Gratis' : `$${course.price}`}
                                                </span>
                                                <button className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors">
                                                    Ver Detalles
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-white/50">No hay cursos disponibles en este momento.</div>
                            )}
                        </section>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="glass-card p-8 max-w-4xl">
                        <h2 className="text-2xl font-bold mb-6">Configuración</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Personalización Visual */}
                            <section className="space-y-6">
                                <h3 className="text-xl font-semibold flex items-center gap-2">
                                    <Settings size={20} className="text-primary-400" /> Apariencia
                                </h3>

                                <div className="space-y-4">
                                    <label className="block text-sm text-white/70">Tema de la Interfaz</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => handleThemeChange('student-blue')}
                                            className={`p-3 rounded-xl border flex items-center gap-2 ${theme === 'student-blue' ? 'border-primary-500 bg-primary-500/20' : 'border-white/10 hover:bg-white/5'}`}
                                        >
                                            <div className="w-4 h-4 rounded-full bg-[#0f172a] border border-white"></div>
                                            Estudiante Blue
                                        </button>
                                        <button
                                            onClick={() => handleThemeChange('profile-white')}
                                            className={`p-3 rounded-xl border flex items-center gap-2 ${theme === 'profile-white' ? 'border-primary-500 bg-primary-500/20' : 'border-white/10 hover:bg-white/5'}`}
                                        >
                                            <div className="w-4 h-4 rounded-full bg-slate-100 border border-gray-400"></div>
                                            Perfil Claro
                                        </button>
                                        <button
                                            onClick={() => handleThemeChange('lilac-premium')}
                                            className={`p-3 rounded-xl border flex items-center gap-2 ${theme === 'lilac-premium' ? 'border-purple-500 bg-purple-500/20' : 'border-white/10 hover:bg-white/5'}`}
                                        >
                                            <div className="w-4 h-4 rounded-full bg-purple-900 border border-purple-400"></div>
                                            Lilac Premium
                                        </button>
                                        {(user?.role === 'TEACHER' || user?.role === 'ADMIN') && (
                                            <button
                                                onClick={() => handleThemeChange('teacher-black')}
                                                className={`p-3 rounded-xl border flex items-center gap-2 ${theme === 'teacher-black' ? 'border-yellow-500 bg-yellow-500/20' : 'border-white/10 hover:bg-white/5'}`}
                                            >
                                                <div className="w-4 h-4 rounded-full bg-black border border-yellow-500"></div>
                                                Black Premium
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-sm text-white/70">Logo / Avatar</label>
                                    <div className="flex gap-4">
                                        {['https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
                                            'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
                                            'https://api.dicebear.com/7.x/bottts/svg?seed=Tech',
                                            'https://api.dicebear.com/7.x/initials/svg?seed=ED'
                                        ].map((url, i) => (
                                            <img
                                                key={i}
                                                src={url}
                                                alt="avatar"
                                                className={`w-12 h-12 rounded-full cursor-pointer border-2 transition-transform hover:scale-110 ${user?.avatar === url ? 'border-primary-500' : 'border-transparent'}`}
                                                onClick={() => handleAvatarChange(url)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* Zona Horaria y Relojes */}
                            <section className="space-y-6">
                                <h3 className="text-xl font-semibold flex items-center gap-2">
                                    <Clock size={20} className="text-primary-400" /> Zona Horaria
                                </h3>

                                <div className="glass-card p-4 bg-black/20">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-sm text-white/50">Hora Local (Tú)</span>
                                        <span className="text-2xl font-mono font-bold text-primary-400">
                                            {currentTime.toLocaleTimeString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="glass-card p-4 bg-black/20">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-sm text-white/50">Hora Global (UTC)</span>
                                        <span className="text-xl font-mono text-white/80">
                                            {currentTime.toLocaleTimeString('en-US', { timeZone: 'UTC' })}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-white/70 mb-1">Tu Zona Horaria</label>
                                    <select
                                        className="premium-input bg-[#0f172a]"
                                        value={selectedTimezone}
                                        onChange={(e) => {
                                            setSelectedTimezone(e.target.value);
                                            authService.updateProfile({ timezone: e.target.value });
                                        }}
                                    >
                                        <option value="UTC">UTC (Universal)</option>
                                        <option value="America/New_York">New York (EST)</option>
                                        <option value="Europe/London">London (GMT)</option>
                                        <option value="Asia/Tokyo">Tokyo (JST)</option>
                                    </select>
                                </div>
                            </section>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
