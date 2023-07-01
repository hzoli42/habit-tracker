import React, { PropsWithChildren } from "react";
import SimpleAppBar from "./appbar";
const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <SimpleAppBar />
      {children}
    </>
  );
};
export default Layout;
