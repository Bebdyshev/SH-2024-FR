"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import React, { useState } from "react";
import { cn } from "@/utils/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import VideoThumb from "@/public/images/hero-image-01.jpg";

type PricingSwitchProps = {
  onSwitch: (value: string) => void;
};

type PricingCardProps = {
  isYearly?: boolean;
  title: string;
  monthlyPrice?: number;
  yearlyPrice?: number;
  description: string;
  features: string[];
  actionLabel: string;
  popular?: boolean;
  exclusive?: boolean;
};

const PricingHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <section className="text-center">
    <h2
      className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text pb-5 font-nacelle text-4xl font-semibold text-transparent md:text-5xl"
      data-aos="fade-up"
    >
      {title}
    </h2>
    <p className="mb-8 text-xl text-indigo-200/65" data-aos="fade-up" data-aos-delay={200}>
      {subtitle}
    </p>
  </section>
);

const PricingSwitch = ({ onSwitch }: PricingSwitchProps) => (
  <Tabs defaultValue="0" className="w-40 mx-auto" onValueChange={onSwitch}>
    <TabsList className="py-6 px-2">
      <TabsTrigger value="0" className="text-base">Monthly</TabsTrigger>
      <TabsTrigger value="1" className="text-base">Yearly</TabsTrigger>
    </TabsList>
  </Tabs>
);

const PricingCard = ({ isYearly, title, monthlyPrice, yearlyPrice, description, features, actionLabel, popular, exclusive }: PricingCardProps) => {
  const handleButtonClick = () => {
    if (actionLabel === "Get Started") {
      window.location.href = "/signin"; // Redirect to /signin
    } else if (actionLabel === "Contact Sales") {
      window.location.href = "https://cal.com/gabitov/30min"; // Redirect to Telegram
    }
  };

  return (
    <Card
      className={cn(`w-72 flex flex-col justify-between py-1 ${popular ? "border-rose-400" : "border-zinc-700"} mx-auto sm:mx-0`, {
        "animate-background-shine bg-white dark:bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] transition-colors":
          exclusive,
      })}>
      <div>
        <CardHeader className="pb-8 pt-4">
          {isYearly && yearlyPrice && monthlyPrice ? (
            <div className="flex justify-between">
              <CardTitle className="text-zinc-700 dark:text-zinc-300 text-lg">{title}</CardTitle>
              <div className={cn("px-2.5 rounded-xl h-fit text-sm py-1 bg-zinc-200 text-black dark:bg-zinc-800 dark:text-white", {
                  "bg-gradient-to-r from-orange-400 to-rose-400 dark:text-black ": popular,
                })}>
                Save ${monthlyPrice * 12 - yearlyPrice}
              </div>
            </div>
          ) : (
            <CardTitle className="text-zinc-700 dark:text-zinc-300 text-lg">{title}</CardTitle>
          )}
          <div className="flex gap-0.5">
            <h3 className="text-3xl font-bold">{yearlyPrice && isYearly ? "$" + yearlyPrice : monthlyPrice ? "$" + monthlyPrice : "Custom"}</h3>
            <span className="flex flex-col justify-end text-sm mb-1">{yearlyPrice && isYearly ? "/year" : monthlyPrice ? "/month" : null}</span>
          </div>
          <CardDescription className="pt-1.5 h-12">{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {features.map((feature: string) => (
            <CheckItem key={feature} text={feature} />
          ))}
        </CardContent>
      </div>
      <CardFooter className="mt-2">
        <Button
          onClick={handleButtonClick} // Add click handler
          className="relative inline-flex w-full items-center justify-center rounded-md bg-black text-white dark:bg-white px-6 font-medium  dark:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        >
          <div className="absolute -inset-0.5 -z-10 rounded-lg bg-gradient-to-b from-[#c7d2fe] to-[#8678f9] opacity-75 blur" />
          {actionLabel}
        </Button>
      </CardFooter>
    </Card>
  );
};

const CheckItem = ({ text }: { text: string }) => (
  <div className="flex gap-2">
    <CheckCircle2 size={20} className="my-auto text-green-400" /> {/* Standardized size */}
    <p className="pt-0.5 text-zinc-700 dark:text-zinc-300 text-sm">{text}</p>
  </div>
);

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const togglePricingPeriod = (value: string) => setIsYearly(parseInt(value) === 1);

  const plans = [
    {
      title: "Basic",
      monthlyPrice: 10,
      yearlyPrice: 100,
      description: "Perfect for startups ready to kick off their hiring journey.",
      features: [
        "Access to essential platform features",
        "Support for up to 3 job listings",
        "Automated candidate sourcing",
        "Basic analytics on applicant responses",
      ],
      actionLabel: "Get Started",
    },
    {
      title: "Pro",
      monthlyPrice: 25,
      yearlyPrice: 250,
      description: "Designed for teams seeking advanced recruitment tools.",
      features: [
        "All Basic features included",
        "Support for up to 10 job listings",
        "Advanced analytics and reporting",
        "Priority support from our team",
        "Access to exclusive AI tools",
      ],
      actionLabel: "Get Started",
      popular: true,
    },
    {
      title: "Enterprise",
      description: "Comprehensive solutions for large organizations.",
      features: [
        "All Pro features included",
        "Unlimited job listings",
        "Customizable solutions tailored to your business",
        "Dedicated account manager",
        "Exclusive early access to new features",
      ],
      actionLabel: "Contact Sales",
      exclusive: true,
    },
  ];

  return (
    <div className="py-8">
      <div className="border-t py-12 [border-image:linear-gradient(to_right,transparent,theme(colors.slate.400/.25),transparent)1] md:py-20">
        <PricingHeader
          title="Pricing Plans"
          subtitle="Choose the subscription that's right for you"
        />
        <PricingSwitch onSwitch={togglePricingPeriod} />
        <section className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-8 mt-8">
          {plans.map((plan) => <PricingCard key={plan.title} {...plan} isYearly={isYearly} />)}
        </section>
      </div>
    </div>
  );
}