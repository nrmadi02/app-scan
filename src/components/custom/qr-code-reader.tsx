/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { useEffect, useRef, useState } from "react";

import QrScanner from "qr-scanner";
import Image from "next/image";

const QrReader = (props: {
  onSuccess: (result: QrScanner.ScanResult) => void;
}) => {
  const scanner = useRef<QrScanner>();
  const videoEl = useRef<HTMLVideoElement>(null);
  const qrBoxEl = useRef<HTMLDivElement>(null);
  const [qrOn, setQrOn] = useState<boolean>(true);

  const onScanSuccess = (result: QrScanner.ScanResult) => {
    props.onSuccess(result);

    if (scanner.current) {
      scanner.current.stop();
      scanner.current = undefined; 
    }
  };

  const onScanFail = (err: string | Error) => {
    console.log(err);
  };

  useEffect(() => {
    if (videoEl?.current && !scanner.current) {
      scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
        onDecodeError: onScanFail,
        preferredCamera: "environment",
        highlightScanRegion: true,
        highlightCodeOutline: true,
        overlay: qrBoxEl?.current ?? undefined,
      });
      scanner?.current
        ?.start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false);
        });
    }
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (!videoEl?.current) {
        scanner?.current?.stop();
      }
    };
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!qrOn)
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload.",
      );
  }, [qrOn]);

  return (
    <div className="qr-reader relative">
      {/* QR */}
      <video
        className="rounded-[10px] border h-[300px] lg:h-[400px] border-gray-400"
        style={{
          width: "100%",
          objectFit: "cover",
        }}
        ref={videoEl}
      ></video>
      <div ref={qrBoxEl} className="qr-box left-0 w-full">
        <Image
          src={"/images/qr-frame.svg"}
          alt="_"
          width={300}
          height={300}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 fill-none"
        />
      </div>
    </div>
  );
};

export default QrReader;