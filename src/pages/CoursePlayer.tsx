import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play,
    CheckCircle,
    Lock,
    ChevronRight,
    ChevronDown,
    Menu,
    Award,
    Clock,
    ArrowLeft
} from 'lucide-react';
import { courseService } from '../services/courseService';
import type { Course, Lesson } from '../types/course';
// import VideoBackground from '../components/VideoBackground'; // Unused

const CoursePlayer: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();

    // State
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
    const [showSidebar, setShowSidebar] = useState(true);

    // Mock Data loading (Fallback if API fails during migration)
    useEffect(() => {
        const fetchCourse = async () => {
            if (!courseId) return;
            try {
                setLoading(true);
                const data = await courseService.getCourse(courseId);
                setCourse(data);

                // Set first lesson as active
                if (data.sections.length > 0 && data.sections[0].lessons.length > 0) {
                    setActiveLesson(data.sections[0].lessons[0]);
                    setExpandedSections({ [data.sections[0].id]: true });
                }
            } catch (error) {
                console.error("Failed to load course", error);
                // Fallback for demo purposes if backend isn't ready
                setCourse(mockCourseData);
                setActiveLesson(mockCourseData.sections[0].lessons[0]);
                setExpandedSections({ [mockCourseData.sections[0].id]: true });
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId]);

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const handleLessonSelect = (lesson: Lesson) => {
        if (!course?.isEnrolled && !lesson.isFree) return;
        setActiveLesson(lesson);
        // Scroll to top?
    };

    if (loading) return <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">Cargando experiencia de aprendizaje...</div>;

    if (!course) return <div className="min-h-screen flex items-center justify-center text-white">Curso no encontrado</div>;

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex flex-col overflow-hidden">
            {/* Header */}
            <header className="h-16 border-b border-white/10 flex items-center px-6 justify-between bg-[#0f172a]/95 backdrop-blur z-20 sticky top-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="h-6 w-[1px] bg-white/10"></div>
                    <div className="flex flex-col">
                        <h1 className="font-bold text-sm md:text-base leading-tight">{course.title}</h1>
                        <div className="flex items-center gap-2 text-xs text-white/50">
                            <span className="flex items-center gap-1"><Clock size={10} /> 12h 30m</span>
                            <span>•</span>
                            <span>{course.teacher.name}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end mr-4">
                        <span className="text-xs text-white/70 mb-1">Tu Progreso: 35%</span>
                        <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-primary-500 to-indigo-500 w-[35%]"></div>
                        </div>
                    </div>
                    <button className="premium-button text-xs px-4 py-2 flex items-center gap-2">
                        <Award size={16} /> Certificado
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Content (Video) */}
                <main className="flex-1 flex flex-col overflow-y-auto relative">
                    {/* Cinematic Video Container */}
                    <div className="w-full bg-black aspect-video relative group">
                        {activeLesson?.videoUrl ? (
                            <iframe
                                src={activeLesson.videoUrl.replace('watch?v=', 'embed/')}
                                className="w-full h-full"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title={activeLesson.title}
                            ></iframe>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                                <div className="text-center p-8">
                                    <div className="inline-flex p-4 rounded-full bg-white/5 mb-4 group-hover:scale-110 transition-transform duration-500">
                                        <Lock size={32} className="text-white/30" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white/50">Contenido Bloqueado</h3>
                                    <p className="text-white/30 mt-2 max-w-md">Debes inscribirte en este curso para acceder a esta lección.</p>
                                </div>
                            </div>
                        )}

                        {/* Overlay Controls (Optional, for aesthetic) */}
                        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </div>

                    {/* Lesson Content / Tabs */}
                    <div className="flex-1 bg-[#0f172a] p-8 max-w-5xl mx-auto w-full">
                        <div className="mb-8 border-b border-white/10 pb-4">
                            <h2 className="text-2xl font-bold mb-4">{activeLesson?.title}</h2>
                            <p className="text-white/70 leading-relaxed">
                                {activeLesson?.description || "En esta lección aprenderemos los conceptos fundamentales para dominar este tema. Asegúrate de revisar los recursos adjuntos."}
                            </p>
                        </div>

                        {/* Resources & Comments Placeholder */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="glass-card p-6">
                                <h3 className="font-bold mb-4">Recursos de la clase</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-sm text-primary-400 cursor-pointer hover:underline">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                        Material del curso.pdf
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-primary-400 cursor-pointer hover:underline">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                                        Código fuente inicial
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Sidebar Curriculum */}
                <motion.aside
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: showSidebar ? 380 : 0, opacity: showSidebar ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="border-l border-white/10 bg-[#0f172a]/50 backdrop-blur-xl h-full overflow-hidden flex flex-col"
                >
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0f172a]">
                        <h3 className="font-bold">Contenido del Curso</h3>
                        <span className="text-xs text-white/50">{course.sections.reduce((acc, s) => acc + s.lessons.length, 0)} lecciones</span>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {course.sections.map((section) => (
                            <div key={section.id} className="border-b border-white/5">
                                <button
                                    onClick={() => toggleSection(section.id)}
                                    className="w-full px-4 py-4 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
                                >
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-sm line-clamp-1">{section.title}</h4>
                                        <span className="text-xs text-white/40">{section.lessons.length} lecciones</span>
                                    </div>
                                    {expandedSections[section.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                </button>

                                <AnimatePresence>
                                    {expandedSections[section.id] && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="bg-black/20"
                                        >
                                            {section.lessons.map((lesson) => (
                                                <div
                                                    key={lesson.id}
                                                    onClick={() => handleLessonSelect(lesson)}
                                                    className={`px-4 py-3 pl-8 flex items-start gap-3 cursor-pointer transition-all border-l-2 ${activeLesson?.id === lesson.id
                                                        ? 'bg-primary-500/10 border-primary-500'
                                                        : 'border-transparent hover:bg-white/5'
                                                        }`}
                                                >
                                                    <div className="mt-1">
                                                        {lesson.completed ? (
                                                            <CheckCircle size={14} className="text-green-500" />
                                                        ) : (course.isEnrolled || lesson.isFree) ? (
                                                            <Play size={14} className={activeLesson?.id === lesson.id ? 'text-primary-400' : 'text-white/30'} />
                                                        ) : (
                                                            <Lock size={14} className="text-white/20" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className={`text-sm ${activeLesson?.id === lesson.id ? 'text-white font-medium' : 'text-white/70'}`}>
                                                            {lesson.title}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-xs text-white/30">{Math.floor(lesson.duration / 60)} min</span>
                                                            {lesson.isFree && !course.isEnrolled && (
                                                                <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                                                                    Gratis
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </motion.aside>

                {/* Floating Toggle for Sidebar */}
                {!showSidebar && (
                    <button
                        onClick={() => setShowSidebar(true)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-primary-600 p-2 rounded-l-xl shadow-lg hover:pr-4 transition-all z-30"
                    >
                        <Menu size={20} />
                    </button>
                )}
            </div>
        </div>
    );
};

// Mock Data for Demo
const mockCourseData: Course = {
    id: '1',
    title: 'Master en React 2026: De Cero a Experto',
    description: 'Aprende React 19, Hooks, Context, Redux y mucho más.',
    price: 19.99,
    teacher: { name: 'Juan Pérez' },
    isEnrolled: true,
    sections: [
        {
            id: 's1',
            title: 'Introducción a React',
            order: 1,
            lessons: [
                { id: 'l1', title: '¿Qué es React?', duration: 300, isFree: true, order: 1, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', completed: true },
                { id: 'l2', title: 'Configuración del Entorno', duration: 420, isFree: true, order: 2, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
            ]
        },
        {
            id: 's2',
            title: 'Hooks Fundamentales',
            order: 2,
            lessons: [
                { id: 'l3', title: 'useState en profundidad', duration: 600, isFree: false, order: 1, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
                { id: 'l4', title: 'useEffect y ciclo de vida', duration: 800, isFree: false, order: 2, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
            ]
        }
    ]
};

export default CoursePlayer;
