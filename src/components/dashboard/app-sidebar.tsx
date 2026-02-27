import {
    BarChart3,
    Globe2,
    LineChart,
    PieChart,
    Settings,
    Wallet
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
    {
        title: "Global Macro",
        url: "#",
        icon: Globe2,
    },
    {
        title: "Equities",
        url: "#",
        icon: BarChart3,
    },
    {
        title: "Derivatives",
        url: "#",
        icon: LineChart,
    },
    {
        title: "Options Flow",
        url: "#",
        icon: PieChart,
    },
    {
        title: "Bonds & Rates",
        url: "#",
        icon: Wallet,
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings,
    },
]

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader className="border-b px-4 py-4">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <Globe2 className="h-6 w-6" />
                    <span>World Dashboard</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Markets</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
