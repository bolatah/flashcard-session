import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import wrapper from "../store/store";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
//import { store } from "@/store/store";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const { store } = wrapper.useWrappedStore(pageProps);
  return (
    <Provider store={store}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar
          closeOnClick
          pauseOnHover
        />
      </SessionProvider>
    </Provider>
  );
}
