"use client"

import * as React from "react"
import {
  BookOpen,
  Box,
  LayoutDashboard,
  Layers,
  Users,
  ShoppingCart,
  Store,
  Calendar,
  Gift,
  Palette,
  Settings,
  HelpCircle,
  Menu,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Customers",
      url: "/customers",
      icon: Users,
    },
    {
      title: "Products",
      url: "/products",
      icon: Box,
    },
    {
      title: "Recipes",
      url: "/recipes",
      icon: BookOpen,
    },
    {
      title: "Orders",
      url: "/orders",
      icon: ShoppingCart,
    },
    {
      title: "Categories",
      url: "/categories",
      icon: Layers,
    },
    {
      title: "Sub Categories",
      url: "/subCategories",
      icon: Layers,
    },
    {
      title: "Brands",
      url: "/brands",
      icon: Store,
    },
    {
      title: "Occasions",
      url: "/occasions",
      icon: Calendar,
    },
    {
      title: "Recipients",
      url: "/recipients",
      icon: Users,
    },
    {
      title: "Packaging",
      url: "/packaging",
      icon: Gift,
    },
    {
      title: "Elements",
      url: "/colors",
      icon: Palette,
      items: [
          {title: "Colors", url: "/colors"}
      ]
    },
  ],
}

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="px-6 py-4 bg-transparent">
         <Link href="/" className="flex flex-col items-center justify-center text-decoration-none">
            <img src="/logo.png" alt="Flower Bloom" className="h-[80px] w-auto object-contain mb-2" />
            <div className="text-center">
              <span style={{ fontFamily: '"Lobster", cursive', fontSize: '22px', display: 'block', lineHeight: '1.2' }} className="text-foreground">Flower Bloom</span>
              <span style={{ fontFamily: '"Quicksand", sans-serif', fontSize: '11px', letterSpacing: '2px' }} className="text-muted-foreground uppercase block mt-1">Control Center</span>
            </div>
         </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>

          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                {item.items ? (
                  <>
                    <SidebarMenuButton 
                        asChild 
                        tooltip={item.title}
                        isActive={pathname.startsWith(item.url)}
                    >
                        <div className="flex items-center w-full">
                            <item.icon className="h-4 w-4" />
                            <span className="ml-3 font-medium">{item.title}</span>
                        </div>
                    </SidebarMenuButton>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                            <Link href={subItem.url}>{subItem.title}</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </>
                ) : (
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.title}
                    isActive={pathname === item.url || pathname.startsWith(item.url + '/')}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span className="ml-3 font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-neutral-200" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">Admin User</span>
            <span className="text-xs text-neutral-500">admin@crunchy.com</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
