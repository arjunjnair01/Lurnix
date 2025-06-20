import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
}

interface NavigationBreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
  onNavigate?: (item: BreadcrumbItem, index: number) => void
}

export function NavigationBreadcrumb({ items, className, onNavigate }: NavigationBreadcrumbProps) {
  return (
    <nav className={cn("flex items-center space-x-1 text-sm", className)} aria-label="Breadcrumb">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-slate-400 mx-1" />
          )}
          <Button
            variant={index === items.length - 1 ? "ghost" : "ghost"}
            size="sm"
            className={cn(
              "h-auto p-1 text-sm font-medium transition-colors duration-200",
              index === items.length - 1
                ? "text-slate-900 cursor-default hover:bg-transparent"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            )}
            onClick={() => onNavigate?.(item, index)}
            disabled={index === items.length - 1}
          >
            {item.icon && <span className="mr-1">{item.icon}</span>}
            {item.label}
          </Button>
        </div>
      ))}
    </nav>
  )
}

// Convenience component for common breadcrumb patterns
export function PageBreadcrumb({ 
  currentPage, 
  parentPages = [], 
  onNavigate 
}: {
  currentPage: string
  parentPages?: string[]
  onNavigate?: (page: string, index: number) => void
}) {
  const items: BreadcrumbItem[] = [
    { label: "Home", icon: <Home className="h-4 w-4" /> },
    ...parentPages.map(page => ({ label: page })),
    { label: currentPage }
  ]

  return (
    <NavigationBreadcrumb 
      items={items} 
      onNavigate={(item, index) => onNavigate?.(item.label, index)}
      className="mb-6"
    />
  )
} 