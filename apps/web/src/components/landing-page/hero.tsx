import Image from "next/image";
import Link from "next/link";
import { ArrowRight, StarIcon } from "lucide-react";

import PreviewDark from "@/assets/dark-preview.png";
import PreviewLight from "@/assets/preview.png";
import { AnimatedGroup } from "@/components/ui/animated-group";
import {
  delayedTransitionVariants,
  transitionVariants,
} from "@/lib/transitions";


export function Hero() {
  return (
    <div className="flex w-full max-w-6xl flex-col gap-12 md:gap-16">
      <AnimatedGroup variants={transitionVariants}>
        <div className="flex flex-col gap-12 px-4 md:px-6">
          <div className="flex flex-col gap-y-4">


            <div className="flex flex-col items-center justify-center gap-3 text-center md:gap-6">
              <h1 className="font-satoshi text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
                Questfully Calendar
              </h1>
              <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
                We are on a Quest to master time! A beautiful, AI-powered calendar designed to help you organize your life and save time. Open source and privacy-first.
              </p>
            </div>  {/* <p className="max-w-xl text-base text-muted-foreground md:text-lg">
              Analog redefines what it means to use a calendar. Analog is an AI-powered calendar that understands your life, and helps you organize and save time. It's an AI-powered calendar that understands your life, and helps you organize and save time.
            </p> */}
          </div>
        </div>
      </AnimatedGroup>

      <AnimatedGroup
        variants={delayedTransitionVariants}
        className="overflow-hidden"
      >
        <div className="mx-auto w-full min-w-[300vw] px-4 sm:max-w-7xl sm:min-w-0 sm:translate-x-0 sm:px-6">
          {/* <div className="w-full [--base-height:874px] [--display-height:calc(var(--base-height)_*_var(--preview-scale))] [--preview-scale:0.5] sm:[--preview-scale:0.8]">
            <div className="[--item-width:1400px]">
              <CalendarWindow className="h-(--base-height) w-(--item-width) scale-(--preview-scale) origin-top-left" />
            </div>
          </div>
          <CalendarWindow className="w-full h-[50vh]" /> */}
          <Image
            src={PreviewDark}
            alt="Hero"
            className="hidden rounded-lg dark:block"
            unoptimized
          />
          <Image
            src={PreviewLight}
            alt="Hero"
            className="block rounded-lg dark:hidden"
            unoptimized
          />
        </div>
      </AnimatedGroup>
    </div >
  );
}
