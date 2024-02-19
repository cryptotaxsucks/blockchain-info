type BlockchainData = {
  [key: string]: {
    CountrySupported: string[];
    ExchangeSupported: string[];
    BlockchainsSupported: string[];
    NftProtocolsSupported: string[];
    DefiProtocolsSupported: string[];
    Trustpilot: string;
  };
};

type ScoreData = {
  [key: string]: {
    name: string;
    score: number;
    trustPilotScore: number;
    blockchains: string[];
    exchanges: string[];
  };
};
