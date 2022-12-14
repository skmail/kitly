import { App, Extension } from "@kitly/system";
import { createContext, PropsWithChildren, useContext } from "react";

const Context = createContext<App>({} as App);

export function AppProvider({
  app,
  children,
}: PropsWithChildren<{ app: App }>) {
  return <Context.Provider value={app}>{children}</Context.Provider>;
}

export const useApp = <T extends Extension[]>() =>
  useContext(Context) as App<T>;
