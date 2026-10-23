import React, { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import { useAuth } from './AuthContext';

type Theme = 'student-blue' | 'teacher-black' | 'lilac-premium';

const validThemes: Theme[] = ['student-blue', 'teacher-black', 'lilac-premium'];

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    // Default to student-blue, but prefer user's saved theme if available
    const initialTheme = useMemo(() => {
        if (user?.theme && validThemes.includes(user.theme as Theme)) {
            return user.theme as Theme;
        }
        return 'student-blue';
    }, [user]);

    const [theme, setThemeState] = useState<Theme>(initialTheme);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        // Here we would ideally also save to backend
        // authService.updateProfile({ theme: newTheme });
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <div data-theme={theme} className={getThemeClasses(theme)}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
};

// Helper to apply global classes based on theme (optional, if we want to wrap the whole app)
// For now we just return the cleaned children or a wrapper div
function getThemeClasses(theme: Theme): string {
    switch (theme) {
        case 'teacher-black':
            return 'theme-teacher-black';
        case 'lilac-premium':
            return 'theme-lilac-premium';
        default:
            return 'theme-student-blue';
    }
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
