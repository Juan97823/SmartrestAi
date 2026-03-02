"use client"

import * as React from "react"
import {
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  Box,
  TrendingUp,
  MessageSquare,
  Settings,
  Users,
  PieChart,
  ChefHat,
  MapPin,
  ChevronDown
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SUCURSALES } from "@/lib/mock-data"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const menuItems = [
  { title: "Panel", icon: LayoutDashboard, url: "/" },
  { title: "Mesas", icon: UtensilsCrossed, url: "/tables" },
  { title: "Pedidos", icon: ClipboardList, url: "/orders" },
  { title: "Cocina", icon: ChefHat, url: "/kitchen" },
  { title: "Inventario", icon: Box, url: "/inventory" },
  { title: "IA Insights", icon: TrendingUp, url: "/ai-insights" },
  { title: "Rentabilidad", icon: TrendingUp, url: "/rentabilidad" },
  { title: "Reportes", icon: PieChart, url: "/reports" },
  { title: "Chat Interno", icon: MessageSquare, url: "/chat" },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [activeBranch, setActiveBranch] = React.useState(SUCURSALES[0])

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="h-16 flex items-center px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <UtensilsCrossed className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{activeBranch.nombre}</span>
                <span className="truncate text-xs">{activeBranch.ubicacion}</span>
              </div>
              <ChevronDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg" align="start" side="bottom" sideOffset={4}>
            {SUCURSALES.map((sucursal) => (
              <DropdownMenuItem key={sucursal.id} onClick={() => setActiveBranch(sucursal)} className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <MapPin className="size-4 shrink-0" />
                </div>
                {sucursal.nombre}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Gestión</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-accent" />
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium truncate">Admin Usuario</span>
            <span className="text-xs text-muted-foreground truncate">Gerencia General</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
