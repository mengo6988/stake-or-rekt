export function formatAddress(address: string | undefined, startChars: number = 6, endChars: number = 4): string | undefined {
  if (!address || address.length < (startChars + endChars)) {
    return address;
  }
  
  return `${address.substring(0, startChars)}...${address.substring(address.length - endChars)}`;
}

