"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Bookmark,
  BriefcaseBusiness,
  Building2,
  FileText,
  PlusCircle,
  LayoutDashboard,
  Settings,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client"
import { isUserRole, type UserRole } from "@/lib/user-role"

type DashboardLink = {
  name: string
  url: string
  icon: LucideIcon
}

const menuItemsByRole: Record<UserRole, DashboardLink[]> = {
  seeker: [
    { name: "Dashboard", url: "/dashboard/seeker", icon: LayoutDashboard },
    { name: "Jobs", url: "/dashboard/seeker/jobs", icon: BriefcaseBusiness },
    { name: "Saved Jobs", url: "/dashboard/seeker/saved", icon: Bookmark },
    {
      name: "Applications",
      url: "/dashboard/seeker/applications",
      icon: FileText,
    },
    { name: "Billing", url: "/dashboard/seeker/billing", icon: Wallet },
    { name: "Settings", url: "/dashboard/seeker/settings", icon: Settings },
  ],
  recruiter: [
    { name: "Dashboard", url: "/dashboard/recruiter", icon: LayoutDashboard },
    {
      name: "My Company",
      url: "/dashboard/recruiter/company",
      icon: Building2,
    },
    {
      name: "Manage Jobs",
      url: "/dashboard/recruiter/jobs",
      icon: BriefcaseBusiness,
    },
    {
      name: "Add Jobs",
      url: "/dashboard/recruiter/jobs/new",
      icon: PlusCircle,
    },
    {
      name: "Applications",
      url: "/dashboard/recruiter/applications",
      icon: FileText,
    },
    { name: "Settings", url: "/dashboard/recruiter/settings", icon: Settings },
  ],
  admin: [
    { name: "Dashboard", url: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Users", url: "/dashboard/admin/users", icon: Users },
    { name: "Companies", url: "/dashboard/admin/companies", icon: Building2 },
    { name: "Jobs", url: "/dashboard/admin/jobs", icon: BriefcaseBusiness },
    { name: "Payments", url: "/dashboard/admin/payments", icon: Wallet },
    { name: "Settings", url: "/dashboard/admin/settings", icon: Settings },
  ],
}

function matchesRoute(pathname: string, url: string) {
  return pathname === url || pathname.startsWith(`${url}/`)
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { isMobile, setOpenMobile } = useSidebar()

  // The links should always match the dashboard section currently open, so the
  // route wins over the signed-in user's role (there is no role guard yet).
  const pathRole = pathname.split("/")[2]
  const role: UserRole = isUserRole(pathRole)
    ? pathRole
    : (session?.user?.role ?? "seeker")

  const items = menuItemsByRole[role]
  // Longest match wins, so "/dashboard/seeker/jobs/123" highlights "Jobs"
  // instead of also highlighting the parent "Dashboard" link.
  const activeUrl = items.reduce<string | undefined>((active, item) => {
    if (!matchesRoute(pathname, item.url)) return active
    return !active || item.url.length > active.length ? item.url : active
  }, undefined)

  return (
    <Sidebar>
      {/* Spacer that keeps the menu below the global sticky navbar. */}
      <SidebarHeader className="h-16 shrink-0" />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboards</SidebarGroupLabel>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  isActive={item.url === activeUrl}
                  render={<Link href={item.url} />}
                  onClick={() => {
                    if (isMobile) setOpenMobile(false)
                  }}
                >
                  <item.icon />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
      <SidebarRail />
    </Sidebar>
  )
}
