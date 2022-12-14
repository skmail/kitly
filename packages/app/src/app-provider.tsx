import { App } from "@kitly/system";
import { createContext, PropsWithChildren, useContext } from "react";

const Context = createContext<App>({} as App);

export function AppProvider({
  app,
  children,
}: PropsWithChildren<{ app: App }>) {
  return <Context.Provider value={app}>{children}</Context.Provider>;
}

export const useApp = <T extends App = App>() => useContext(Context) as T ;
