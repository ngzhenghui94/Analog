"use client";

import * as React from "react";

import { authClient } from "@repo/auth/client";
import { env } from "@repo/env/client";

import { AddAccountDialog } from "@/components/settings-dialog/tabs/accounts/add-account-dialog";
import { Button } from "@/components/ui/button";

export function AddAccountButton() {
  const linkAccount = React.useCallback(async () => {
    await authClient.linkSocial({
      provider: "google",
      callbackURL: "/calendar",
    });
  }, []);

  return (
    <AddAccountDialog>
      <Button variant="outline">Add Account</Button>
    </AddAccountDialog>
  );
}
