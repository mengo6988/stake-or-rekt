import React from "react";
import { Toaster } from "react-hot-toast";
import WalletConnectButton from "./WalletConnectButton";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import foresightLogo from "@public/foresightLogo.svg";
// import Banner from "@/components/banner/Banner";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  // const [showBanner, setShowBanner] = useState(true);

  const currentPath = router.pathname;
  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 w-full h-full bg-gradient-background -z-20" />
      {/* {showBanner && (
        <button onClick={() => setShowBanner(false)} className="w-full">
          <Banner speed={50}>
            <span className="text-base font-medium">
              We’re aware of Privy being temporarily down at the moment. Please
              try again in a few hours
            </span>
          </Banner>
        </button>
      )} */}
      <Toaster position="top-right" />
      <div className="top-0 w-full pt-8 md:pt-10 px-7 md:px-10 flex flex-row items-center z-10 justify-between relative">
        <div className="md:flex flex-row gap-2 text-foreground hidden">
          <Link href="/">
            <div
              className={`w-[90px] text-center font-medium px-4 py-1 ${
                currentPath === "/" || currentPath.startsWith("/market")
                  ? "bg-[#39354C4D] border border-[#3E3B50]"
                  : ""
              }`}
            >
              Markets
            </div>
          </Link>
          <Link href="/loans">
            <div
              className={`w-[90px] font-medium text-center px-4 py-1 ${
                currentPath.startsWith("/loans")
                  ? "bg-[#39354C4D] border border-[#3E3B50]"
                  : ""
              }`}
            >
              Loans
            </div>
          </Link>
          <Link href="/rewards">
            <div
              className={`w-[90px] text-center font-medium px-4 py-1 ${
                currentPath.startsWith("/rewards")
                  ? "bg-[#39354C4D] border border-[#3E3B50]"
                  : ""
              }`}
            >
              Rewards
            </div>
          </Link>
        </div>

        <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
          <Link href={"/"} className="w-fit h-fit">
            <Image
              src={foresightLogo}
              alt="Foresight Logo"
              width={153}
              height={39}
              priority
              className="object-cover"
            />
          </Link>
        </div>
        <div className="relative flex items-center justify-center  md:hidden">
          <Link href={"/"} className="w-fit h-fit">
            <Image
              src={foresightLogo}
              alt="Foresight Logo"
              width={153}
              height={39}
              priority
              className="object-cover"
            />
          </Link>
        </div>
        <div className="flex items-center justify-end ">
          <WalletConnectButton />
        </div>
      </div>
      <main className="text-foreground">{children}</main>
    </div>
  );
};

export default Layout;
