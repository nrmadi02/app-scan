import { type PropsWithChildren } from "react";

const MobileLayout = (props: PropsWithChildren) => {
  return (
    <main className="mx-auto overflow-auto bg-white relative min-h-screen max-w-md border px-5 ">{props.children}</main>
  );
};

export default MobileLayout;
