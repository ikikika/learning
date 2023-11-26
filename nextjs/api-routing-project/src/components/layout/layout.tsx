import { ReactNode } from "react";

import MainHeader from "./main-header";

function Layout(props: { children: ReactNode }) {
  return (
    <>
      <MainHeader />
      <main>{props.children}</main>
    </>
  );
}

export default Layout;
