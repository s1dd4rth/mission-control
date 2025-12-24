import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'

export type Theme = 'light' | 'dark' | 'system'

interface ThemeToggleProps {
    onThemeChange?: (theme: Theme) => void
    className?: string
}

export function ThemeToggle({ onThemeChange, className }: ThemeToggleProps) {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window !== 'undefined') {
            return (localStorage.getItem('theme') as Theme) || 'system'
        }
        return 'system'
    })

    useEffect(() => {
        const root = document.documentElement

        const applyTheme = (targetTheme: Theme) => {
            if (targetTheme === 'system') {
                const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
                root.classList.toggle('dark', systemDark)
            } else {
                root.classList.toggle('dark', targetTheme === 'dark')
            }
        }

        applyTheme(theme)
        localStorage.setItem('theme', theme)

        // Notify parent
        onThemeChange?.(theme)

        // Listen for system theme changes when in system mode
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleChange = () => {
            if (theme === 'system') {
                applyTheme('system')
            }
        }
        mediaQuery.addEventListener('change', handleChange)

        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [theme, onThemeChange])

    const toggleTheme = () => {
        setTheme((prev) => {
            if (prev === 'light') return 'dark'
            if (prev === 'dark') return 'system'
            return 'light'
        })
    }

    const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)

    return (
        <button
            onClick={toggleTheme}
            className={`w-9 h-9 flex items-center justify-center rounded-md text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors ${className || ''}`}
            title={`Theme: ${theme}`}
        >
            {isDark ? (
                <Moon className="w-5 h-5" strokeWidth={1.5} />
            ) : (
                <Sun className="w-5 h-5" strokeWidth={1.5} />
            )}
        </button>
    )
}
