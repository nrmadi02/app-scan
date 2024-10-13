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

  const { mutateAsync, data } = api.auth.signInQR.useMutation({
    mutationKey: ["signInQR", Socket],
    onSuccess: (data) => {
      setIsOpen(false);
      toast.success("Successfully scanned QR Code");
      socket.emit("scan-code", data.data);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSignInQR = async () => {
    await mutateAsync({
      generatedCode: "APP-PAP-1a7e6b76-e2d3-4b79-a7ea-03664b48bafb",
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
      <div className="mt-5">
        <h1>Dashboard</h1>
        <Button onClick={() => signOut()}>Logout</Button>
        <Button className="mt-5" onClick={() => setIsOpen(true)}>
          Open QR Code Scanner
        </Button>
        <div>
          <h2>Generated QR Code</h2>
          <div className="mt-2">
            <pre>{data && JSON.stringify(data, null, 2)}</pre>
          </div>
        </div>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[90%] rounded-md">
          <h1 className="text-2xl font-bold">Scan QR Code</h1>
          <QrReader
            onSuccess={async (result) => {
              console.log(result.data);
              await handleSignInQR();
            }}
          />
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
}
