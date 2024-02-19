import rawData from "@/assets/data/blockchain-data.json";

import { addCryptoData, rateCryptos } from "@/utils/queries/JsonData";
import { FormSchema } from "@/utils/zod/FormSchema";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const data = FormSchema.parse(
      (await req.json()) as z.infer<typeof FormSchema>,
    );

    // console.log(data);

    const crypto = rateCryptos(data, rawData);

    const result = addCryptoData(data, rawData, crypto);

    // console.log(result);

    return new Response(JSON.stringify(result), {
      status: 200,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    } else {
      // Handle the case where error is not an instance of Error
      console.error("An unexpected error occurred");
      return new Response(
        JSON.stringify({ error: "An unexpected error occurred" }),
        {
          status: 500,
        },
      );
    }
  }
};
