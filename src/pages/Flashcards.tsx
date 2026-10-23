import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Plus,
    Search,
    Edit,
    Trash2,
    Play,
    Lock,
    Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { flashcardService } from '../services/flashcardService';
import type { FlashcardDeck } from '../services/flashcardService';
import VideoBackground from '../components/VideoBackground';

const Flashcards: React.FC = () => {
    const navigate = useNavigate();
    const [decks, setDecks] = useState<FlashcardDeck[]>([]);
    const [publicDecks, setPublicDecks] = useState<FlashcardDeck[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showPublic, setShowPublic] = useState(false);

    useEffect(() => {
        loadDecks();
    }, []);

    const loadDecks = async () => {
        try {
            setLoading(true);
            const [myDecks, pubDecks] = await Promise.all([
                flashcardService.getMyDecks(),
                flashcardService.getPublicDecks()
            ]);
            setDecks(myDecks);
            setPublicDecks(pubDecks);
        } catch (error) {
            console.error('Error loading decks:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredDecks = (showPublic ? publicDecks : decks).filter(deck =>
        deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deck.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDeleteDeck = async (deckId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este mazo?')) {
            try {
                await flashcardService.deleteDeck(deckId);
                await loadDecks();
            } catch (error) {
                console.error('Error deleting deck:', error);
                alert('Error al eliminar el mazo');
            }
        }
    };

    const startReview = (deckId: string) => {
        navigate(`/flashcards/review/${deckId}`);
    };

    const editDeck = (deckId: string) => {
        navigate(`/flashcards/edit/${deckId}`);
    };

    return (
        <div className="relative min-h-screen">
            <VideoBackground
                videoUrl="https://assets.mixkit.co/videos/preview/mixkit-starry-night-sky-over-a-mountain-range-11009-large.mp4"
                overlayOpacity={0.7}
            />

            <div className="relative z-10 p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-7xl mx-auto"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                                <BookOpen className="text-primary-400" size={40} />
                                Flashcards
                            </h1>
                            <p className="text-white/70">
                                Crea y estudia con tarjetas de memoria para mejorar tu aprendizaje
                            </p>
                        </div>
                        <button
                            onClick={() => console.log('Create modal not implemented')}
                            className="premium-button flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Nuevo Mazo
                        </button>
                    </div>

                    {/* Filters and Search */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar mazos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="premium-input pl-10 w-full"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowPublic(false)}
                                className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                                    !showPublic
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-white/5 text-white/70 hover:bg-white/10'
                                }`}
                            >
                                <Lock size={16} />
                                Mis Mazos
                            </button>
                            <button
                                onClick={() => setShowPublic(true)}
                                className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                                    showPublic
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-white/5 text-white/70 hover:bg-white/10'
                                }`}
                            >
                                <Globe size={16} />
                                Públicos
                            </button>
                        </div>
                    </div>

                    {/* Decks Grid */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="text-white/50">Cargando mazos...</div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredDecks.map((deck) => (
                                <motion.div
                                    key={deck.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="glass-card p-6 hover:scale-105 transition-transform"
                                    style={{ borderLeft: `4px solid ${deck.color}` }}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold mb-2">{deck.title}</h3>
                                            {deck.description && (
                                                <p className="text-white/60 text-sm mb-2 line-clamp-2">
                                                    {deck.description}
                                                </p>
                                            )}
                                            {deck.course && (
                                                <div className="text-xs text-primary-400 mb-2">
                                                    📚 {deck.course.title}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {deck.isPublic ? (
                                                <Globe size={16} className="text-green-400" />
                                            ) : (
                                                <Lock size={16} className="text-white/40" />
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm text-white/50">
                                            {deck._count?.cards || 0} tarjetas
                                        </span>
                                        {showPublic && deck.user && (
                                            <span className="text-xs text-white/40">
                                                por {deck.user.name}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => startReview(deck.id)}
                                            className="flex-1 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <Play size={16} />
                                            Estudiar
                                        </button>
                                        {!showPublic && (
                                            <>
                                                <button
                                                    onClick={() => editDeck(deck.id)}
                                                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteDeck(deck.id)}
                                                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {filteredDecks.length === 0 && !loading && (
                        <div className="text-center py-16">
                            <BookOpen size={64} className="text-white/20 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">
                                {showPublic ? 'No hay mazos públicos' : 'No tienes mazos aún'}
                            </h3>
                            <p className="text-white/50 mb-6">
                                {showPublic
                                    ? 'Los mazos públicos aparecerán aquí cuando otros usuarios los compartan'
                                    : 'Crea tu primer mazo de flashcards para empezar a estudiar'
                                }
                            </p>
                            {!showPublic && (
                                <button
                                    onClick={() => console.log('Create modal not implemented')}
                                    className="premium-button"
                                >
                                    Crear Primer Mazo
                                </button>
                            )}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Create Deck Modal would go here */}
        </div>
    );
};

export default Flashcards;