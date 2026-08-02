import { createContext, useContext, type ReactNode } from 'react';

export type HostProps = {
  /** Optional host-provided title for sample Route 1 observability. */
  title?: string;
};

const HostPropsContext = createContext<HostProps>({});

export function HostPropsProvider({
  value,
  children,
}: {
  value: HostProps;
  children: ReactNode;
}) {
  return (
    <HostPropsContext.Provider value={value}>
      {children}
    </HostPropsContext.Provider>
  );
}

export function useHostProps(): HostProps {
  return useContext(HostPropsContext);
}
