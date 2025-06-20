import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200">
          <Sun className="h-4 w-4 text-slate-800 dark:text-slate-200 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 text-slate-800 dark:text-slate-200 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 shadow-xl">
        <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200">
          <Sun className="mr-2 h-4 w-4 text-slate-800 dark:text-slate-200" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200">
          <Moon className="mr-2 h-4 w-4 text-slate-800 dark:text-slate-200" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200">
          <span className="mr-2 h-4 w-4">💻</span>
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 