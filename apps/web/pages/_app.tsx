import type { AppProps } from "next/app";
import "../styles/index.css";
function AppPage({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
export default AppPage;
