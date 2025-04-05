import { Button } from "@/components/buttons/Button";
import DepositModal from "@/components/modals/DepositModal";
import ProfileModal from "@/components/modals/ProfileModal";
import { extendedERC20ABI } from "@/config/abi/ERC20";
import { useUnifiedWallet } from "@/hooks/useUnifiedWallet";
import { UserResponse } from "@/types/user";
import { formatAddress } from "@/utils/format";
import { usePrivy } from "@privy-io/react-auth";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Address, formatUnits } from "viem";
import { useReadContract } from "wagmi";
import sampleProfilePicImage from "@public/images/sampleProfilePic.png";
import ProfileDrawer from "@/components/drawers/ProfileDrawer";
import posthog from "posthog-js";

const WalletConnectButton = () => {
  const router = useRouter();
  const { ready, authenticated, login } = usePrivy();
  const [isRouterReady, setIsRouterReady] = useState(false);
  const { userBalance, address, walletType } = useUnifiedWallet();
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [username, setUsername] = useState<string | undefined>();
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false)

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
    const checkUser = async () => {
      if (walletType !== "smart" || !address || !authenticated) return;

      try {
        const response = await axios.post(
          `/api/user/check`,
          { walletAddress: address },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        const userData = response.data as UserResponse;
        posthog.identify(userData.id, {
          username: userData.username,
          address: userData.address
        })
        //if (!posthog._isIdentified()) {
        //}
        setUsername(userData.username);
      } catch (error) {
        console.error("Error checking for user: ", error);
      }
    };

    checkUser();
  }, [address, walletType, authenticated, router, isRouterReady]);

  if (!ready) {
    return (
      <Button onClick={login} className="" variant="primary">
        Login
      </Button>
    );
  }

  if (!authenticated) {
    return (
      <Button onClick={login} className="" variant="primary">
        Login
      </Button>
    );
  }

  return (
    <div className="relative flex items-center justify-center gap-3 z-20">
      <div className="hidden md:flex flex-row items-center justify-center gap-3">
        <div className="flex flex-col items-start justify-start text-muted font-regular text-xs leading-3">
          Balance{" "}
          <span className="font-medium text-md text-primary-foreground">
            ${Number(formatUnits(userBalance, Number(decimals))).toFixed(2)}
          </span>
        </div>
        <div>
          <Button
            onClick={() => {
              setIsDepositModalOpen(true);
            }}
          >
            {" "}
            Deposit{" "}
          </Button>
        </div>
      </div>
      <button
        className="hidden md:flex md:w-36 md:h-9 flex-row justify-center items-center gap-2 md:px-5 md:py-2 md:bg-[#191919] md:border md:border-[#211F1F]"
        onClick={() => {
          setIsProfileModalOpen(true);
        }}
      >
        <Image
          src={sampleProfilePicImage}
          alt="profile pic"
          width={36}
          height={36}
          className="object-cover md:w-5 md:h-5 w-9 h-9 md:rounded-full"
        />

        <div className="text-sm font-medium text-center text-[#BFBFBF]">
          {formatAddress(address)}
        </div>
      </button>
      <button
        className="block md:hidden"
        onClick={() => {setIsProfileDrawerOpen(!isProfileDrawerOpen)}}
      >
        <Image
          src={sampleProfilePicImage}
          alt="profile pic"
          width={36}
          height={36}
          className="object-cover md:w-5 md:h-5 w-9 h-9 md:rounded-full"
        />
      </button>
      {isDepositModalOpen && (
        <DepositModal setIsModalOpen={setIsDepositModalOpen} />
      )}
      {isProfileModalOpen && (
        <ProfileModal
          setIsModalOpen={setIsProfileModalOpen}
          setIsDepositModalOpen={setIsDepositModalOpen}
          username={username || "User"}
        />
      )}
      <ProfileDrawer isOpen={isProfileDrawerOpen} setIsOpen={setIsProfileDrawerOpen}/>
    </div>
  );
};

export default WalletConnectButton;
