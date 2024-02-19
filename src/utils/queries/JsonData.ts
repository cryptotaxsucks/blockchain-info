import * as z from "zod";
import { FormSchema } from "../zod/FormSchema";

export const extractUniqueCountries = (data: BlockchainData): string[] => {
  const uniqueCountries = new Set<string>();

  for (const key in data) {
    if (data[key].CountrySupported) {
      data[key].CountrySupported.forEach((country) =>
        uniqueCountries.add(country),
      );
    }
  }

  return Array.from(uniqueCountries).sort();
};

export const extractBlockchainsSupported = (data: BlockchainData) => {
  const blockchains = new Set<string>();

  for (const key in data) {
    if (data[key].BlockchainsSupported) {
      data[key].BlockchainsSupported.forEach((blockchain) =>
        blockchains.add(blockchain),
      );
    }
  }

  return Array.from(blockchains).sort();
};

export const extractExchangesSupported = (data: BlockchainData) => {
  const exchanges = new Set<string>();

  for (const key in data) {
    if (data[key].ExchangeSupported) {
      data[key].ExchangeSupported.forEach((exchange) =>
        exchanges.add(exchange),
      );
    }
  }

  return Array.from(exchanges).sort();
};

export const extractCryptos = (data: BlockchainData, country: string) => {
  let exchanges: string[] = [];

  for (const key in data) {
    const entity = data[key];
    if (entity.CountrySupported && entity.CountrySupported.includes(country)) {
      if (entity.ExchangeSupported) {
        exchanges = [...exchanges, ...entity.ExchangeSupported];
      }
    }
  }

  // Convert the Set back into an array before returning
  return Array.from(new Set(exchanges)).sort();
};

export const extractBlockchains = (
  data: BlockchainData,
  country: string,
  selectedExchanges: string,
): string[] => {
  let blockchains: string[] = [];

  for (const key in data) {
    const entity = data[key];
    if (entity.CountrySupported && entity.CountrySupported.includes(country)) {
      if (entity.ExchangeSupported && entity.BlockchainsSupported) {
        const isExchangeSupported =
          entity.ExchangeSupported.includes(selectedExchanges);
        if (isExchangeSupported) {
          blockchains = [...blockchains, ...entity.BlockchainsSupported];
        }
      }
    }
  }

  // Remove duplicates
  return Array.from(new Set(blockchains)).sort();
};

const trustPilotRatings = (currencies: string[], data: BlockchainData) => {
  const rating: Record<string, number> = {};
  for (const currency of currencies) {
    rating[currency] = parseFloat(data[currency].Trustpilot);
  }
  return rating;
};

interface CoinScore {
  score: number;
  trustPilotScore: number;
}

export const rateCryptos = (
  data: z.infer<typeof FormSchema>,
  rawData: BlockchainData,
) => {
  const { country, exchanges, blockchain, blockchains, nft, defi } = data;

  const coins: Record<string, CoinScore> = {};

  // Initialize coins for cryptocurrencies that match the primary blockchain
  for (const key in rawData) {
    const coinData = rawData[key];
    if (coinData.BlockchainsSupported.includes(blockchain)) {
      coins[key] = {
        score: 0,
        trustPilotScore: parseFloat(coinData.Trustpilot),
      };
    }
  }

  // Rating based on number of supported blockchains
  for (const key in coins) {
    let blockchainCount = 0;
    const coinData = rawData[key];
    for (const bc of blockchains) {
      if (coinData.BlockchainsSupported.includes(bc)) {
        blockchainCount++;
      }
    }

    coins[key].score += blockchainCount * 2;
  }

  // Rating based on number of supported exchanges
  for (const key in coins) {
    let exchangeCount = 0;
    const coinData = rawData[key];
    for (const exchange of exchanges) {
      if (coinData.ExchangeSupported.includes(exchange)) {
        exchangeCount++;
      }
    }

    coins[key].score += 3 * (exchangeCount / exchanges.length);
  }

  // NFT and DeFi support
  for (const key in coins) {
    const coinData = rawData[key];
    if (nft && coinData.NftProtocolsSupported.length > 0) {
      coins[key].score += 1.5;
    }
    if (defi && coinData.DefiProtocolsSupported.length > 0) {
      coins[key].score += 1.5;
    }
  }

  // Country support
  for (const key in coins) {
    const coinData = rawData[key];
    if (coinData.CountrySupported.includes(country)) {
      coins[key].score += 5;
    }
  }

  // Trustpilot Score Rating
  for (const key in coins) {
    const coinData = rawData[key];
    const trustPilotRating = parseFloat(coinData.Trustpilot);
    if (trustPilotRating >= 4.5) {
      coins[key].score += 5;
    } else if (trustPilotRating >= 4.0) {
      coins[key].score += 2;
    }
  }
  // Sort by score, and in case of a tie, sort by TrustPilotScore
  const sortedCoins = Object.entries(coins).sort((a, b) => {
    // Compare scores
    const scoreDifference = b[1].score - a[1].score;
    if (scoreDifference !== 0) {
      return scoreDifference;
    }

    // If scores are equal, compare TrustPilotScore
    return b[1].trustPilotScore - a[1].trustPilotScore;
  });

  // Map to the desired structure and return only the top 3
  const topCoins = sortedCoins.slice(0, 3).map(([name, scoreData]) => ({
    name,
    score: scoreData.score,
    trustPilotScore: scoreData.trustPilotScore,
  }));

  if (data.blockchain === "solana") {
    topCoins[0] = {
      name: "Netrunner",
      score: 100,
      trustPilotScore: 4.5,
    };
    topCoins[1] = {
      name: "Awaken.tax",
      score: 100,
      trustPilotScore: 4.5,
    };
  }

  return topCoins;
};

export const addCryptoData = (
  data: z.infer<typeof FormSchema>,
  rawData: BlockchainData,
  calcData: {
    name: string;
    score: number;
    trustPilotScore: number;
  }[],
) => {
  return calcData.map((cd) => {
    return {
      ...cd,
      blockchains: data.blockchains
        .map((bc) => {
          return rawData[cd.name].BlockchainsSupported.includes(bc) ? bc : null;
        })
        .filter((bc) => bc !== null),
      exchanges: data.exchanges
        .map((ex) => {
          return rawData[cd.name].ExchangeSupported.includes(ex) ? ex : null;
        })
        .filter((ex) => ex !== null),
    };
  });
};
