"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import QrReader from "~/components/custom/qr-code-reader";
import MobileLayout from "~/components/layout/mobile.layout";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import { api } from "~/trpc/react";
import io, { Socket } from "socket.io-client";

let socket: Socket;

export default function DashboardPage() {
  const session = useSession();

  const [isOpen, setIsOpen] = useState(false);

  const { mutateAsync, isPending } = api.auth.signInQR.useMutation({
    mutationKey: ["signInQR", Socket],
    onSuccess: (data) => {
      setIsOpen(false);
      toast.success("Successfully scanned QR Code");
      socket.emit("scan-code", data.data);
    },
    onError: (error) => {
      toast.error(error.message);
      setIsOpen(false);
    },
  });

  const handleSignInQR = async (code: string) => {
    await mutateAsync({
      generatedCode: code,
      userId: session.data?.user.id ?? "",
    });
  };

  useEffect(() => {
    socket = io();
    socket.on("message", (msg) => {
      console.log("Message from server:", msg);
    });
    socket.on("connect_error", (err) => {
      console.error("Connection Error:", err);
    });

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <MobileLayout>
      <div className="mt-5 flex w-max flex-col">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p>Selamat datang di SSO Dashboard</p>
        <Button className="w-max mt-2" onClick={() => signOut()}>Logout</Button>
      </div>
      <div className="h-[400px] w-full flex flex-col items-center justify-center">
        <p className="text-xl font-bold">Scan QR Code from APP Client</p>
        <Button className="mt-3" onClick={() => setIsOpen(true)}>
          Open QR Code Scanner
        </Button>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[90%] rounded-md">
          <h1 className="text-2xl font-bold">Scan QR Code</h1>
          <QrReader
            isLoading={isPending}
            onSuccess={async (result) => {
              console.log(result.data);
              await handleSignInQR(result.data);
            }}
          />
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
}
