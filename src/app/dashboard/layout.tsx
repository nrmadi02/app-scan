import SessionClientProvider from "~/components/provider/session.provider";
import { Toaster } from "~/components/ui/sonner";
import { HydrateClient } from "~/trpc/server";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <HydrateClient>
      <Toaster />
      <SessionClientProvider>{children}</SessionClientProvider>
    </HydrateClient>
  );
}