import { type NextPage } from "next";

import Header from "@/components/ui/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map } from "@/components/map";
import { requireAuth } from "@/utils/requireAuth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import GoogleMapsComponent from "@/components/google-maps-component";
import { api } from "@/utils/api";
import HolidaysList from "@/components/holidays-list";

export const getServerSideProps = requireAuth(undefined, '/scrapbook');

const Scrapbook: NextPage = () => {
    const router = useRouter();
    const addHoliday = () => {
        void router.push('/add-holiday');
    }
    const { isLoading, data: holidays, isError } = api.holiday.getHolidays.useQuery();

    if (isLoading) return <div>Loading...</div>;

    if (isError) return <div>Error</div>;
    return (
        <>
            <div className="flex flex-row">
                <Header className="pb-4 flex-1">My Scrapbook</Header>
                <Button onClick={addHoliday}>Add Holiday</Button>
            </div>
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
        </>
    );
};

export default Scrapbook;
