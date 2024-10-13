"use client";

import { type PropsWithChildren, type ReactNode, Suspense } from "react";

const SuspenseLayout = (props: PropsWithChildren<{
  fallBack?: ReactNode;
}>) => {
  return <Suspense fallback={props.fallBack}>{props.children}</Suspense>;
};

export default SuspenseLayout;
