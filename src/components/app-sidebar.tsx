"use client"

import * as React from "react"
import {
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  Box,
  TrendingUp,
  MessageSquare,
  PieChart,
  ChefHat,
  MapPin,
  ChevronDown,
  BarChart3,
  LogOut
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { SUCURSALES } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { useAuth } from "@/firebase"
import { signOut } from "firebase/auth"

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
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"

const menuItems = [
  { title: "Panel de Control", icon: LayoutDashboard, url: "/" },
  { title: "Gestión de Mesas", icon: UtensilsCrossed, url: "/tables" },
  { title: "Pedidos en Vivo", icon: ClipboardList, url: "/orders" },
  { title: "Monitor de Cocina", icon: ChefHat, url: "/kitchen" },
  { title: "Inventario Inteligente", icon: Box, url: "/inventory" },
  { title: "Analítica Predictiva", icon: TrendingUp, url: "/ai-insights" },
  { title: "Rentabilidad IA", icon: BarChart3, url: "/rentabilidad" },
  { title: "Reportes de Venta", icon: PieChart, url: "/reports" },
  { title: "Asistente de Soporte", icon: MessageSquare, url: "/chat" },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const auth = useAuth()
  const [activeBranch, setActiveBranch] = React.useState(SUCURSALES[0])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/login')
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200">
      <SidebarHeader className="h-20 flex items-center px-4 border-b border-slate-100">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="hover:bg-slate-50 transition-colors">
              <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg rotate-3">
                <UtensilsCrossed className="size-5" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                <span className="truncate font-bold text-primary">{activeBranch.nombre}</span>
                <span className="truncate text-[10px] text-muted-foreground uppercase tracking-widest">{activeBranch.ubicacion}</span>
              </div>
              <ChevronDown className="ml-auto size-4 text-muted-foreground" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl shadow-xl border-slate-200" align="start" side="bottom" sideOffset={10}>
            <div className="px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-tighter">Seleccionar Sucursal</div>
            {SUCURSALES.map((sucursal) => (
              <DropdownMenuItem key={sucursal.id} onClick={() => setActiveBranch(sucursal)} className="gap-2 p-3 cursor-pointer hover:bg-primary/5">
                <div className="flex size-7 items-center justify-center rounded-lg border bg-slate-50">
                  <MapPin className="size-4 text-primary" />
                </div>
                <div className="flex flex-col">
                   <span className="font-medium">{sucursal.nombre}</span>
                   <span className="text-[10px] text-muted-foreground">{sucursal.ubicacion}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>
      
      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-2">Administración</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2 space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    className={cn(
                      "rounded-xl px-4 py-6 transition-all",
                      pathname === item.url 
                        ? "bg-primary/10 text-primary font-bold shadow-sm" 
                        : "hover:bg-slate-100 text-slate-600"
                    )}
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className={cn("h-5 w-5", pathname === item.url ? "text-primary" : "text-slate-400")} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-slate-100">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 w-full hover:bg-slate-50 p-2 rounded-xl transition-colors text-left">
              <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center text-accent-foreground font-bold shadow-md">
                AD
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold truncate text-slate-800">Admin Usuario</span>
                <span className="text-[10px] text-muted-foreground truncate uppercase tracking-tighter">Gerente General</span>
              </div>
              <ChevronDown className="ml-auto size-4 text-slate-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 rounded-xl shadow-2xl border-slate-200" align="end" side="top" sideOffset={12}>
             <DropdownMenuItem className="p-3 gap-2 cursor-pointer hover:bg-slate-50">
               <div className="size-8 rounded-lg bg-slate-100 flex items-center justify-center">
                 <MapPin className="size-4 text-slate-500" />
               </div>
               <span className="text-sm">Configuración Perfil</span>
             </DropdownMenuItem>
             <DropdownMenuSeparator />
             <DropdownMenuItem onClick={handleLogout} className="p-3 gap-2 cursor-pointer text-destructive hover:bg-destructive/10">
               <div className="size-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                 <LogOut className="size-4" />
               </div>
               <span className="text-sm font-bold">Cerrar Sesión</span>
             </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
