import { Fragment, ReactNode } from "react";

import MainNavigation from "./main-navigation";

function Layout({ children }: { children: ReactNode }) {
  return (
    <Fragment>
      <MainNavigation />
      <main>{children}</main>
    </Fragment>
  );
}

export default Layout;
