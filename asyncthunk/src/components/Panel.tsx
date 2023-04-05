import classNames from "classnames";
import { ReactNode } from "react";

interface PropType {
  children: ReactNode;
  className: string;
}

function Panel({ children, className, ...rest }: PropType) {
  const finalClassNames = classNames(
    "border rounded p-3 shadow bg-white w-full",
    className
  );

  return (
    <div {...rest} className={finalClassNames}>
      {children}
    </div>
  );
}

export default Panel;
