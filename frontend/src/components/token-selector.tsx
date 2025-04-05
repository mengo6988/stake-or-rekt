import React, { useState, useEffect } from "react";
import { getTokensOwnedByAccount, TokenData } from "../lib/token-utils";
import { Loader, AlertCircle, Coins } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TokenSelectorProps {
  accountAddress?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  helperText?: string;
}

const TokenSelector = ({
  accountAddress,
  value,
  onChange,
  disabled = false,
  label = "Token Address",
  placeholder = "0x...",
  helperText = "Enter a token address",
}: TokenSelectorProps) => {
  const [userTokens, setUserTokens] = useState<TokenData[]>([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);
  const [error, setError] = useState("");
  const [isMockData, setIsMockData] = useState(false);

  useEffect(() => {
    async function fetchUserTokens() {
      if (!accountAddress) return;

      setIsLoadingTokens(true);
      setError("");
      setIsMockData(false);

      try {
        const tokens = await getTokensOwnedByAccount(accountAddress);
        setUserTokens(tokens);

        // Check if we're using mock data
        if (
          tokens?.length > 0 &&
          tokens[0].tokenAddress ===
            "0x4200000000000000000000000000000000000006"
        ) {
          setIsMockData(true);
        }
      } catch (error: any) {
        console.error("Failed to load user tokens:", error);
        setError(error.message || "Failed to load your tokens");
      } finally {
        setIsLoadingTokens(false);
      }
    }

    fetchUserTokens();
  }, [accountAddress]);

  return (
    <div className="space-y-2">
      {label && <Label htmlFor="token-input">{label}</Label>}

      <div className="space-y-2">
        <Input
          id="token-input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />

        {accountAddress && (
          <div className="w-full">
            {isLoadingTokens ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader className="h-4 w-4 animate-spin" />
                <span>Loading your tokens...</span>
              </div>
            ) : error ? (
              <div className="flex items-center gap-2 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            ) : userTokens.length > 0 ? (
              <>
                <Select value="" onValueChange={onChange} disabled={disabled}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select from your tokens" />
                  </SelectTrigger>
                  <SelectContent>
                    {userTokens.map((token) => (
                      <SelectItem
                        key={token.tokenAddress}
                        value={token.tokenAddress}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span>{token.symbol || token.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {token.balance}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {isMockData && (
                  <div className="flex items-center gap-2 text-xs text-amber-500 mt-1">
                    <Coins className="h-3 w-3" />
                    <span>Using demo token data</span>
                  </div>
                )}
              </>
            ) : (
              <p className="text-xs text-muted-foreground">
                No tokens found for this account
              </p>
            )}
          </div>
        )}
      </div>

      {helperText && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
};

export default TokenSelector;
