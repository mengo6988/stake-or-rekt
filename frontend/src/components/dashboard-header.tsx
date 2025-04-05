"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Bell, Menu, Trophy, } from "lucide-react"
import { useRouter } from "next/router"
import { cn } from "@/lib/utils"
import WalletConnectButton from "./wallet-connect-button"

export function DashboardHeader() {
  const router = useRouter()
  const [isConnected, setIsConnected] = useState(false)

  const isBattle = router.pathname.startsWith("/active-battles");
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-12">
      <div className="w-full flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link href="/" className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-white" />
            <span className="text-xl font-bold">Stake-or-Rekt</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 ml-6">
            <Link
              href="/"
              className={cn("text-sm font-medium hover:text-foreground transition-colors", isBattle && "text-muted-foreground" )}
            >
              Home
            </Link>
            <Link href="/active-battles" 
              className={cn("text-sm font-medium hover:text-foreground transition-colors", !isBattle && "text-muted-foreground" )}
              >
              Active Battles
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <WalletConnectButton />

          {/* <ConnectButton /> */}
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


