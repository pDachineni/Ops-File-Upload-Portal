
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from "lucide-react";

export function Header() {
  return (
    <header className="w-full border-b bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="p-2 hover:bg-slate-100 rounded-lg transition-colors" />
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">FM</span>
            </div>
            <div>
              <span className="font-bold text-xl text-slate-800">Operations File Upload Portal</span>
              <span className="text-sm text-slate-500 block -mt-1">Upload Excel Files To Load Data In CDMS</span>
            </div>
          </div>
        </div>
        
        <div className="ml-auto flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-slate-100">
                <Avatar className="h-10 w-10 border-2 border-slate-200">
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback className="bg-slate-100 text-slate-700 font-medium">JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white border shadow-lg rounded-xl" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-3">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium text-slate-800">John Doe</p>
                  <p className="w-[200px] truncate text-sm text-slate-500">
                    john@example.com
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover:bg-slate-50">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover:bg-slate-50 text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
