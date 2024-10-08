export const chainsName = { inco: "Inco" };

export const incoNetwork = {
  id: 9000,
  network: "Inco Rivest Testnet",
  name: "INCO",
  nativeCurrency: {
    name: "INCO",
    symbol: "INCO",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://validator.rivest.inco.org/"],
    },
    public: {
      http: ["https://validator.rivest.inco.org/"],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://explorer.testnet.inco.org",
    },
  },
};
