import * as z from "zod";

export const FormSchema = z.object({
  country: z.string({
    required_error: "Please select a Country.",
  }),
  exchanges: z.array(z.string()).min(1, {
    message: "Please select at least one Crypto Exchange.",
  }),
  blockchain: z.string({
    required_error: "Please select Blockchain.",
  }),
  blockchains: z.array(z.string()).min(1, {
    message: "Please select at least one Blockchain.",
  }),
  nft: z.boolean({
    required_error: "Please select NFT.",
  }),
  defi: z.boolean({
    required_error: "Please select Defi Protocol.",
  }),
});
