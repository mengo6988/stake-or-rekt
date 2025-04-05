"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Icon, Menu, Trophy, Wallet } from "lucide-react"
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useRouter } from "next/router"
import { cn } from "@/lib/utils"

export function DashboardHeader() {
  const router = useRouter()
  const [isConnected, setIsConnected] = useState(false)

  const isBattle = router.pathname.startsWith("/active-battles");
  return (
    <header className="top-0 z-50 w-full  px-12">
      <div className="w-full flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link href="/" className="flex items-center gap-2">
            <span className="text-4xl font-black">Stake-or-Rekt</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 ml-6">
            <Link href="/active-battles" 
              className={cn("text-sm font-medium hover:text-foreground transition-colors", !isBattle && "text-muted-foreground" )}
              >
              Active Battles
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">

          <ConnectButton showBalance={false} chainStatus="icon"/>
          {/* {isConnected ? ( */}
          {/*   <> */}
          {/*     <Button variant="outline" size="sm" className="hidden md:flex gap-2"> */}
          {/*       <Wallet className="h-4 w-4" /> */}
          {/*       <span>1,245 TKNS</span> */}
          {/*     </Button> */}
          {/*     <Button variant="ghost" size="icon"> */}
          {/*       <Bell className="h-5 w-5" /> */}
          {/*       <span className="sr-only">Notifications</span> */}
          {/*     </Button> */}
          {/*     <DropdownMenu> */}
          {/*       <DropdownMenuTrigger asChild> */}
          {/*         <Button variant="ghost" size="icon" className="rounded-full"> */}
          {/*           <Avatar className="h-8 w-8"> */}
          {/*             <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" /> */}
          {/*             <AvatarFallback>US</AvatarFallback> */}
          {/*           </Avatar> */}
          {/*         </Button> */}
          {/*       </DropdownMenuTrigger> */}
          {/*       <DropdownMenuContent align="end"> */}
          {/*         <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
          {/*         <DropdownMenuSeparator /> */}
          {/*         <DropdownMenuItem>Profile</DropdownMenuItem> */}
          {/*         <DropdownMenuItem>Portfolio</DropdownMenuItem> */}
          {/*         <DropdownMenuItem>Settings</DropdownMenuItem> */}
          {/*         <DropdownMenuSeparator /> */}
          {/*         <DropdownMenuItem onClick={() => setIsConnected(false)}>Disconnect</DropdownMenuItem> */}
          {/*       </DropdownMenuContent> */}
          {/*     </DropdownMenu> */}
          {/*   </> */}
          {/* ) : ( */}
          {/*   <Button onClick={() => setIsConnected(true)}>Connect Wallet</Button> */}
          {/* )} */}
        </div>
      </div>
    </header>
  )
}


