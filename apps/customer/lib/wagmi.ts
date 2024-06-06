import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { Config, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http("https://eth-mainnet.g.alchemy.com/v2/..."),
    [sepolia.id]: http("https://eth-sepolia.g.alchemy.com/v2/..."),
  },
}) as Config;
