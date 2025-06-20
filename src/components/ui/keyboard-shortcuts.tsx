import { BookOpen, HelpCircle, MessageCircle, Search, Settings, Upload } from "lucide-react"
import { useEffect } from "react"

interface KeyboardShortcut {
  key: string
  description: string
  icon: React.ReactNode
  action: () => void
}

interface KeyboardShortcutsProps {
  shortcuts: KeyboardShortcut[]
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      const shortcut = shortcuts.find(s => {
        const keys = s.key.toLowerCase().split('+')
        const pressedKeys = []
        
        if (event.ctrlKey || event.metaKey) pressedKeys.push('ctrl')
        if (event.shiftKey) pressedKeys.push('shift')
        if (event.altKey) pressedKeys.push('alt')
        
        const key = event.key.toLowerCase()
        if (key !== 'control' && key !== 'shift' && key !== 'alt' && key !== 'meta') {
          pressedKeys.push(key)
        }
        
        return keys.every(k => pressedKeys.includes(k))
      })

      if (shortcut) {
        event.preventDefault()
        shortcut.action()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}

export function KeyboardShortcutsHelp({ shortcuts }: KeyboardShortcutsProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-slate-900 mb-3">Keyboard Shortcuts</h3>
      <div className="grid gap-2">
        {shortcuts.map((shortcut, index) => (
          <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors duration-200">
            <div className="flex items-center gap-2">
              {shortcut.icon}
              <span className="text-sm text-slate-700">{shortcut.description}</span>
            </div>
            <kbd className="px-2 py-1 text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 rounded-md">
              {shortcut.key}
            </kbd>
          </div>
        ))}
      </div>
    </div>
  )
}

// Common shortcuts for the app
export const commonShortcuts = (actions: {
  onSearch?: () => void
  onUpload?: () => void
  onDashboard?: () => void
  onChat?: () => void
  onSettings?: () => void
  onHelp?: () => void
}): KeyboardShortcut[] => [
  {
    key: 'Ctrl+K',
    description: 'Search',
    icon: <Search className="w-4 h-4" />,
    action: () => actions.onSearch?.()
  },
  {
    key: 'Ctrl+U',
    description: 'Upload Document',
    icon: <Upload className="w-4 h-4" />,
    action: () => actions.onUpload?.()
  },
  {
    key: 'Ctrl+D',
    description: 'Dashboard',
    icon: <BookOpen className="w-4 h-4" />,
    action: () => actions.onDashboard?.()
  },
  {
    key: 'Ctrl+M',
    description: 'AI Chat',
    icon: <MessageCircle className="w-4 h-4" />,
    action: () => actions.onChat?.()
  },
  {
    key: 'Ctrl+,',
    description: 'Settings',
    icon: <Settings className="w-4 h-4" />,
    action: () => actions.onSettings?.()
  },
  {
    key: 'F1',
    description: 'Help',
    icon: <HelpCircle className="w-4 h-4" />,
    action: () => actions.onHelp?.()
  }
] 