import { extendedERC20ABI } from "@/config/abi/ERC20";
import { useUnifiedWallet } from "@/hooks/useUnifiedWallet";
import { formatAddress } from "@/utils/format";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { Address, formatUnits } from "viem";
import { useReadContract } from "wagmi";
import { Button } from "./ui/button";
import { Avatar } from "./ui/avatar";
import { Check, Copy, LogOut, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

const WalletConnectButton = () => {
  const router = useRouter();
  const { ready, authenticated, login, logout } = usePrivy();
  const [isRouterReady, setIsRouterReady] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { nativeBalance, address, walletType } = useUnifiedWallet();
  
  const { data: decimals = BigInt(6) } = useReadContract({
    address: process.env.NEXT_PUBLIC_COLLATERAL_ADDRESS as Address,
    abi: extendedERC20ABI,
    functionName: "decimals",
  }) as { data: bigint };
  
  useEffect(() => {
    if (router.isReady && !router.pathname.includes("[")) {
      setIsRouterReady(true);
    }
  }, [router.isReady, router.pathname]);

  useEffect(() => {
    // Handle clicks outside the dropdown to close it
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const copyToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success("Address copied to clipboard");
    }
  };

  if (!ready) {
    return (
      <Button onClick={login} className="" variant="default">
        Login
      </Button>
    );
  }
  
  if (!authenticated) {
    return (
      <Button onClick={login} className="" variant="default">
        Login
      </Button>
    );
  }
  
  return (
    <div className="relative flex items-center justify-center gap-3 z-20" ref={dropdownRef}>
      <div className="hidden md:flex flex-row items-center justify-center gap-3">
        <div className="flex flex-col items-start justify-start text-muted font-regular text-xs leading-3">
          Balance{" "}
          <span className="font-medium text-md text-primary-foreground">
            ${Number(formatUnits(nativeBalance, Number(18))).toFixed(10)}
          </span>
        </div>
      </div>
      
      {/* Desktop */}
      <div className="hidden md:block relative">
        <button
          className="flex w-36 h-9 flex-row justify-center items-center gap-2 px-5 py-2 bg-[#191919] border border-[#211F1F] rounded-md"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <Avatar />
          <div className="text-sm font-medium text-center text-[#BFBFBF]">
            {formatAddress(address)}
          </div>
          {dropdownOpen ? (
            <ChevronUp className="h-4 w-4 text-[#BFBFBF]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#BFBFBF]" />
          )}
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-[#191919] border border-[#211F1F] rounded-md shadow-lg z-50">
            <div className="py-1">
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-[#BFBFBF] hover:bg-[#252525]"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                Copy Address
              </button>
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-[#BFBFBF] hover:bg-[#252525]"
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Mobile */}
      <div className="block md:hidden relative">
        <button
          className="flex items-center justify-center"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <Avatar />
          {dropdownOpen ? (
            <ChevronUp className="h-4 w-4 ml-1 text-[#BFBFBF]" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-1 text-[#BFBFBF]" />
          )}
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-[#191919] border border-[#211F1F] rounded-md shadow-lg z-50">
            <div className="py-1">
              <div className="px-4 py-2 text-xs text-[#7A7A7A] border-b border-[#211F1F]">
                {address ? formatAddress(address, 6, 4) : ""}
              </div>
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-[#BFBFBF] hover:bg-[#252525]"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                Copy Address
              </button>
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-[#BFBFBF] hover:bg-[#252525]"
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletConnectButton;
