
import { NavLink, useLocation } from "react-router-dom";
import { Upload, BarChart3 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Upload Files",
    url: "/",
    icon: Upload,
    description: "Upload and manage your files"
  },
  {
    title: "File Status",
    url: "/status",
    icon: BarChart3,
    description: "View upload progress and history"
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar className={isCollapsed ? "w-24" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-slate-50 border-r border-slate-200">
        <SidebarGroup>
          <SidebarGroupLabel className={`${isCollapsed ? "sr-only" : ""} text-slate-600 font-medium`}>
            User Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`transition-all duration-200 rounded-lg mx-2 ${
                      isActive(item.url) 
                        ? "bg-blue-100 text-blue-700 border-l-4 border-blue-500 font-medium shadow-sm" 
                        : "hover:bg-slate-100 text-slate-700 hover:text-slate-900"
                    }`}
                  >
                    <NavLink to={item.url} className="flex items-center gap-3 px-3 py-10">
                      <item.icon className={`h-5 w-5 flex-shrink-0 ${
                        isActive(item.url) ? "text-blue-600" : "text-slate-500"
                      }`} />
                      {!isCollapsed && (
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{item.title}</span>
                          <span className="text-xs text-slate-500">
                            {item.description}
                          </span>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
