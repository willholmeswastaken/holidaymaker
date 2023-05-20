import { type NextPage } from "next";

import Header from "@/components/ui/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map } from "@/components/map";
import { requireAuth } from "@/utils/requireAuth";
import GoogleMapsComponent from "@/components/google-maps-component";
import { api } from "@/utils/api";
import HolidaysList from "@/components/holidays-list";
import { Skeleton } from "@/components/ui/skeleton";
import Seo from "@/components/seo";

export const getServerSideProps = requireAuth(undefined, 'scrapbook');

const Scrapbook: NextPage = () => {
    const { isLoading, data: holidays, isError } = api.holiday.getHolidays.useQuery();

    if (isError) return <div>Error</div>;
    return (
        <>
            <Seo
                title="HolidayMaker - Scrapbook"
                description="View your holidays in the map or in your list, it's your scrapbook."
                image="https://holidaymaker.vercel.app/api/og?title=Your holiday scrapbook"
            />
            <div className="flex flex-row">
                <Header className="pb-4 flex-1">My Scrapbook</Header>
            </div>
            {
                isLoading
                    ? (
                        <div className="flex flex-col space-y-4 mt-2">
                            <Skeleton className="h-12 w-80 self-center" />
                            <Skeleton className="h-80 w-full" />
                        </div>
                    )
                    : (
                        <Tabs defaultValue="account" className="w-full flex flex-col">
                            <TabsList className="w-[400px] self-center">
                                <TabsTrigger value="account">Holiday Map</TabsTrigger>
                                <TabsTrigger value="password">Holiday List</TabsTrigger>
                            </TabsList>
                            <TabsContent value="account">
                                <GoogleMapsComponent position="center">
                                    <Map holidays={holidays} />
                                </GoogleMapsComponent>
                            </TabsContent>
                            <TabsContent value="password">
                                <HolidaysList holidays={holidays} />
                            </TabsContent>
                        </Tabs>
                    )
            }
        </>
    );
};

export default Scrapbook;
