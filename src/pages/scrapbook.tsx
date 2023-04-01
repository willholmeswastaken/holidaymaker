import { type NextPage } from "next";

import Header from "@/components/ui/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map } from "@/components/map";
import { HolidaysTable } from "@/components/holidays-table";
import { prisma } from "@/server/db";
import { requireAuth } from "@/utils/requireAuth";
import { getSession } from "next-auth/react";
import { type HolidayWithPhoto } from "@/types/HolidayWithPhoto";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

export const getServerSideProps = requireAuth(async (ctx) => {
    const session = await getSession({ ctx });
    const holidays = (await prisma.holiday.findMany({
        where: {
            userId: session?.user.id,
        },
        include: {
            photos: true,
        },
    }))
        .sort(
            (a, b) =>
                Date.parse(b.loggedAt.toISOString()) -
                Date.parse(a.loggedAt.toISOString())
        );
    return {
        props: {
            holidays
        }
    }
}, '/scrapbook');

type Props = {
    holidays: HolidayWithPhoto[];
}

const Scrapbook: NextPage<Props> = ({ holidays }) => {
    const router = useRouter();
    const addHoliday = () => {
        void router.push('/add-holiday');
    }
    return (
        <>
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20">
                <div className="flex flex-row">
                    <Header className="pb-4 flex-1">My Scrapbook</Header>
                    <Button onClick={addHoliday}>Add Holiday</Button>
                </div>
                <Tabs defaultValue="account" className="w-full flex flex-col">
                    <TabsList className="w-[400px] self-center">
                        <TabsTrigger value="account">Map View</TabsTrigger>
                        <TabsTrigger value="password">Table View</TabsTrigger>
                    </TabsList>
                    <TabsContent value="account">
                        <Map holidays={holidays} />
                    </TabsContent>
                    <TabsContent value="password">
                        <HolidaysTable holidays={holidays} />
                    </TabsContent>
                </Tabs>

            </div>

        </>
    );
};

export default Scrapbook;
