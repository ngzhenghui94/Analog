"use client";

import { useState } from "react";
import Link from "next/link";

import { authClient } from "@repo/auth/client";

import { Logo, LogoSquare } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { providers, type ProviderId } from "@/lib/providers";
import { cn } from "@/lib/utils";

interface SignInFormProps {
  redirectUrl?: string;
}

export function SignInForm({ redirectUrl = "/calendar" }: SignInFormProps) {
  const [loading, setLoading] = useState(false);

  const signInWithProvider = async (id: ProviderId) => {
    await authClient.signIn.social(
      {
        provider: id,
        callbackURL: redirectUrl,
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onResponse: () => {
          setLoading(false);
        },
      },
    );
  };

  return (
    <Card className="max-w-xs border-none bg-background/60 shadow-2xl backdrop-blur-xl ring-1 ring-white/10 subpixel-antialiased todesktop:select-none">
      <CardHeader className="flex flex-col items-center justify-center gap-4 pb-6 pt-8">
        <Logo className="w-32 overflow-visible text-foreground" />
      </CardHeader>
      <CardContent className="pb-8">
        <div className="grid gap-8">
          <div
            className={cn(
              "flex w-full flex-col items-center justify-between gap-4",
            )}
          >
            {providers.map((provider) => {
              return (
                <Button
                  key={provider.id}
                  variant="outline"
                  className="group relative h-11 w-full gap-3 overflow-hidden border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  disabled={loading}
                  onClick={() => signInWithProvider(provider.id)}
                >
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-white/5 blur-xl" />
                  <provider.icon className="relative z-10 size-5 transition-transform duration-300 group-hover:scale-110" />
                  <span className="relative z-10 font-medium">Continue with {provider.name}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-white/5 bg-white/5 py-4">
        <div className="flex w-full justify-center">
          <p className="text-center text-xs text-muted-foreground/60 transition-colors hover:text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link
              href="/terms"
              className="font-medium text-foreground/80 hover:text-foreground hover:underline todesktop:hover:cursor-default"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="font-medium text-foreground/80 hover:text-foreground hover:underline todesktop:hover:cursor-default"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
