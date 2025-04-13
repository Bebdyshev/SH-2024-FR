import type React from "react"
import { Sidebar } from "./app-sidebar"

interface PageContainerProps {
  children: React.ReactNode
  scrollable?: boolean
}

export default function PageContainer({ children, scrollable = false }: PageContainerProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className={`flex-1 p-6 ${scrollable ? "overflow-auto" : ""}`}>{children}</main>
    </div>
  )
}
