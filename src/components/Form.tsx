"use client";

import rawData from "@/assets/data/blockchain-data.json";

import * as z from "zod";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form as FormSh,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";

import Animation from "./Animation";
import { FormSchema } from "@/utils/zod/FormSchema";
import {
  extractBlockchainsSupported,
  extractExchangesSupported,
  extractUniqueCountries,
} from "@/utils/queries/JsonData";
import { ChevronRightIcon, ChevronLeftIcon } from "@radix-ui/react-icons";
import { Combobox } from "./ComboBox";
import { ComboBoxType } from "@/types/ComboBox";
import { Star, StarHalf } from "lucide-react";
import { Badge } from "./ui/badge";
import Script from "next/script";

type QuestionType = {
  variant?: ComboBoxType;
  name:
    | "country"
    | "exchanges"
    | "blockchain"
    | "blockchains"
    | "nft"
    | "defi"
    | `exchanges.${number}`
    | `blockchains.${number}`;
  question: string;
  data: string[];
};

const data: BlockchainData = rawData as BlockchainData;

const ResultCard = ({
  name,
  score,
  country,
  blockchain,
  blockchains,
  exchanges,
}: {
  name: string;
  score: number;
  country?: string;
  blockchain?: string;
  blockchains?: string[];
  exchanges?: string[];
}) => {
  const renderRating = (score: number) => {
    const fullStars = Math.floor(score);
    const hasHalfStar = score - fullStars >= 0.5;

    const stars = [];

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} color="rgb(234 179 8)" fill="rgb(234 179 8)" />,
      );
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <StarHalf key="half" color="rgb(234 179 8)" fill="rgb(234 179 8)" />,
      );
    }

    // Add empty stars
    for (let i = 0; i < 5 - fullStars - (hasHalfStar ? 1 : 0); i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          color="rgb(234 179 8)"
          fill="transparent"
          stroke="rgb(234 179 8)"
        />,
      );
    }

    return stars;
  };

  return (
    <>
      <div className="rounded-lg bg-white/40 p-4">
        <div className="flex flex-row items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-lg font-bold text-theme-blue sm:text-3xl">
              {name}
            </h1>
            <div className="flex flex-row space-x-1">
              {renderRating(score)}
              <p className="text-sm font-semibold text-theme-blue sm:text-lg">
                {score}
              </p>
            </div>
            <div className="flex flex-row space-x-2">
              <Badge className="bg-theme-blue capitalize">{country}</Badge>
              <Badge className="bg-theme-blue capitalize">{blockchain}</Badge>
              {blockchains?.map((blockchain, index) => (
                <Badge key={index} className="bg-theme-blue capitalize">
                  {blockchain}
                </Badge>
              ))}
              {exchanges?.map((exchange, index) => (
                <Badge key={index} className="bg-theme-blue capitalize">
                  {exchange}
                </Badge>
              ))}
              <Badge className="bg-theme-blue">NFT</Badge>
              <Badge className="bg-theme-blue">Defi</Badge>
            </div>
          </div>
          <div>
            <Button
              className="bg-theme-blue hover:bg-theme-blue-100"
              variant="default"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

const Form = () => {
  const countries = extractUniqueCountries(data);
  const blockchains = extractBlockchainsSupported(data);
  const exchanges = extractExchangesSupported(data);

  const [questionNumber, setQuestionNumber] = useState<number>(0);
  const [questions, _] = useState<QuestionType[]>([
    {
      variant: ComboBoxType.DEFAULT,
      name: "blockchain",
      question: "Which Blockchain did you use the most?",
      data: blockchains,
    },
    {
      variant: ComboBoxType.MULTIPLE,
      name: "blockchains",
      question: "What other Blockchains did you use?",
      data: blockchains,
    },
    {
      variant: ComboBoxType.MULTIPLE,
      name: "exchanges",
      question: "What Crypto Exchanges did you use?",
      data: exchanges,
    },
    {
      variant: ComboBoxType.BOOLEAN,
      name: "nft",
      question: "Did you trade NFT's?",
      data: ["Yes", "No"],
    },
    {
      variant: ComboBoxType.BOOLEAN,
      name: "defi",
      question: "Did you use a Defi Protocol?",
      data: ["Yes", "No"],
    },
    {
      variant: ComboBoxType.DEFAULT,
      name: "country",
      question: "What is your Country of Residency?",
      data: countries,
    },
  ]);
  const [result, setResult] = useState<ScoreData | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const selectedCountry = form.watch("country");
  // const selectedExchange = form.watch("exchange");
  const selectedBlockchain = form.watch("blockchain");
  const selectedDefi = form.watch("defi");

  const handleNextQuestion = () => {
    if (questionNumber === questions.length) return;

    setQuestionNumber((prev) => prev + 1);
  };

  const handlePreviousQuestion = () => {
    if (questionNumber === 0) return;

    setQuestionNumber((prev) => prev - 1);
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const response = await fetch("/api/score", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const result = (await response.json()) as ScoreData;

      setResult(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <FormSh {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="my-5 w-3/4 space-y-14 rounded-lg bg-white/40 p-8 drop-shadow-2xl"
        >
          {result ? (
            <Animation>
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-center text-lg font-bold text-theme-blue sm:text-3xl">
                    Best Crypto Tax Software For You
                  </h1>
                  <p>
                    Below are the top three crypto tax software for you based on
                    your answers. If you would like to get help from an expert
                    to get your crypto taxes done without the headache of doing
                    it yourself, fill out the form below to request a flat-rate
                    quote.
                  </p>
                  <div>
                    <iframe
                      src="https://api.leadconnectorhq.com/widget/form/jQn63VlaBJvFaR2Kmvhw"
                      style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                        borderRadius: "3px",
                      }}
                      id="inline-jQn63VlaBJvFaR2Kmvhw"
                      data-layout="{'id':'INLINE'}"
                      data-trigger-type="alwaysShow"
                      data-trigger-value=""
                      data-activation-type="alwaysActivated"
                      data-activation-value=""
                      data-deactivation-type="neverDeactivate"
                      data-deactivation-value=""
                      data-form-name="Contact Form"
                      data-height="458"
                      data-layout-iframe-id="inline-jQn63VlaBJvFaR2Kmvhw"
                      data-form-id="jQn63VlaBJvFaR2Kmvhw"
                      title="Contact Form"
                    ></iframe>
                    <Script src="https://link.msgsndr.com/js/form_embed.js"></Script>
                  </div>
                </div>

                <div className="space-y-2">
                  {result &&
                    (Object.keys(result) as Array<keyof ScoreData>).map(
                      (key, index) => (
                        <ResultCard
                          key={index}
                          name={result[key].name}
                          score={result[key].trustPilotScore}
                          country={selectedCountry}
                          // exchange={selectedExchange}
                          blockchain={selectedBlockchain}
                          blockchains={result[key].blockchains}
                          exchanges={result[key].exchanges}
                        />
                      ),
                    )}
                </div>
              </div>
            </Animation>
          ) : (
            <>
              <div className="space-y-2 sm:space-y-10">
                <h1 className="text-lg font-semibold sm:text-3xl">
                  Question {questionNumber + 1}/{questions.length}
                </h1>
                {questions.map(
                  ({ variant, name, question, data }, index) =>
                    questionNumber === index && (
                      <FormField
                        key={index}
                        control={form.control}
                        name={name}
                        render={({ field }) => (
                          <Animation>
                            <FormItem>
                              <FormLabel className="text-sm sm:text-2xl">
                                {question}
                              </FormLabel>
                              <FormControl>
                                <Combobox
                                  variant={variant}
                                  data={data}
                                  label={name}
                                  handleChange={field.onChange}
                                  value={field.value ?? ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          </Animation>
                        )}
                      />
                    ),
                )}
              </div>

              <div className="space-y-5">
                <Animation>
                  <div className="flex justify-between">
                    <Button
                      id="previous"
                      aria-label="previous"
                      className="h-10 w-10 bg-theme-blue hover:bg-theme-blue-100 sm:h-14 sm:w-14"
                      disabled={questionNumber === 0}
                      variant="default"
                      size="icon"
                      type="button"
                      onClick={handlePreviousQuestion}
                    >
                      <ChevronLeftIcon className="h-6 w-6" />
                    </Button>
                    <Button
                      id="next"
                      aria-label={"next"}
                      className="h-10 w-10 bg-theme-blue hover:bg-theme-blue-100 sm:h-14 sm:w-14"
                      disabled={questionNumber === questions.length - 1}
                      variant="default"
                      size="icon"
                      type="button"
                      onClick={handleNextQuestion}
                    >
                      <ChevronRightIcon className="h-6 w-6" />
                    </Button>
                  </div>
                </Animation>

                {questionNumber === questions.length - 1 &&
                  selectedCountry?.length > 0 && (
                    <div className="space-y-1">
                      <Button
                        id="submit"
                        aria-label="submit"
                        type="submit"
                        className="h-14 w-full bg-theme-blue hover:bg-theme-blue-100"
                        variant={"default"}
                      >
                        Submit
                      </Button>
                      {Object.keys(form.formState.errors).map((key, index) => {
                        const error =
                          form.formState.errors[
                            key as keyof typeof form.formState.errors
                          ];
                        return (
                          <p key={index} className="text-red-600">
                            {error?.message}
                          </p>
                        );
                      })}
                    </div>
                  )}
              </div>
            </>
          )}
        </form>
      </FormSh>
    </>
  );
};

export default Form;
