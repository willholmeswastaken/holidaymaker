import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "@/utils/api";
import HeroHome from "@/components/hero-home";
import Header from "@/components/ui/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Scrapbook: NextPage = () => {
    const hello = api.example.hello.useQuery({ text: "from tRPC" });

    return (
        <>
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
                {/* Hero content */}
                <div className="pt-32 pb-12 md:pt-10 md:pb-20"></div>
                <Header>My Scrapbook</Header>
                <Tabs defaultValue="account" className="w-full flex flex-col">
                    <TabsList className="w-[400px] self-center">
                        <TabsTrigger value="account">Map View</TabsTrigger>
                        <TabsTrigger value="password">Table View</TabsTrigger>
                    </TabsList>
                    <TabsContent value="account">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Make changes to your account here. Click save when you&apos;re done.
                        </p>
                    </TabsContent>
                    <TabsContent value="password">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Change your password here. After saving, you&apos;ll be logged out.
                        </p>
                    </TabsContent>
                </Tabs>

            </div>

        </>
    );
};

export default Scrapbook;
