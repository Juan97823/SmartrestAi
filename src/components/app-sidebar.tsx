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
  ChefHat
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

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

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, url: "/" },
  { title: "Tables", icon: UtensilsCrossed, url: "/tables" },
  { title: "Orders", icon: ClipboardList, url: "/orders" },
  { title: "Kitchen", icon: ChefHat, url: "/kitchen" },
  { title: "Inventory", icon: Box, url: "/inventory" },
  { title: "AI Insights", icon: TrendingUp, url: "/ai-insights" },
  { title: "Reports", icon: PieChart, url: "/reports" },
  { title: "Internal Chat", icon: MessageSquare, url: "/chat" },
]

const adminItems = [
  { title: "Users", icon: Users, url: "/admin/users" },
  { title: "Settings", icon: Settings, url: "/admin/settings" },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="h-16 flex items-center px-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary rounded-lg p-1.5">
            <UtensilsCrossed className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-headline font-bold text-xl text-primary tracking-tight group-data-[collapsible=icon]:hidden">
            SmartRest AI
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Management</SidebarGroupLabel>
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

        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
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
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:hidden">
          <div className="h-8 w-8 rounded-full bg-accent" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">John Doe</span>
            <span className="text-xs text-muted-foreground">Administrator</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}