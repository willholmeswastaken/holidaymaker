import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden dark:bg-slate-900">
      <SessionProvider session={session}>
        <Header />
        <main className="flex-grow">
          <Component {...pageProps} />
        </main>
        <Footer />
      </SessionProvider>
    </div>
  );
};

export default api.withTRPC(MyApp);
