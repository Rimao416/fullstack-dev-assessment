import AuthInitializer from "@/components/AuthInitializer";
import MessageDisplay from "@/components/MessageDisplay";
import { MessageProvider } from "@/context/NotificationContext";
import { store } from "@/store/store";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <AuthInitializer />
      <MessageProvider>
        <MessageDisplay />
        <Component {...pageProps} />
      </MessageProvider>
    </Provider>
  );
}
