"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { YoutubeIcon, Menu } from "lucide-react"

interface NavItem {
  icon: React.ElementType
  label: string
  onClick: () => void
}

interface SidebarProps {
  navItems: NavItem[]
}

export function Sidebar({ navItems }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-4 z-50 md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-background/90 backdrop-blur-sm transition-transform duration-300 md:static md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "md:w-20" : "md:w-64"}`}
      >
        <div className="flex h-16 items-center border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <YoutubeIcon className="h-6 w-6 text-red-600" />
            {!collapsed && <span className="font-bold">Recapify</span>}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto hidden md:flex"
            onClick={() => setCollapsed(!collapsed)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`}
            >
              <path d="m15 6-6 6 6 6" />
            </svg>
          </Button>
        </div>
        <nav className="flex-1 overflow-auto p-3">
          <ul className="space-y-2">
            {navItems.map((item, index) => (
              <li key={index}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    collapsed ? "px-3" : "px-4"
                  } hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-600 transition-all duration-300`}
                  onClick={item.onClick}
                >
                  <item.icon className="h-5 w-5" />
                  {!collapsed && <span className="ml-3">{item.label}</span>}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  )
}

