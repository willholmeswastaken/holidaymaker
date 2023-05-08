import { prisma } from "@/server/db";
import { type HolidayPhotoViewModel, type HolidayWithPhotoViewModel } from "@/types/HolidayWithPhoto";
import { getS3ImageUrl } from "@/utils/getS3ImageUrl";
import { requireAuth } from "@/utils/requireAuth";
import { s3FilePathResolver } from "@/utils/s3FilePathResolver";
import { type NextPage } from "next";
import { getSession } from "next-auth/react";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PhotoPreview from "@/components/photo-preview";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GoogleMapsComponent from "@/components/google-maps-component";
import { Map } from "@/components/map";
import { BackButton } from "@/components/back-button";
import { cn } from "@/utils/cn";

dayjs.extend(relativeTime)

export const getServerSideProps = requireAuth(async (ctx) => {
    const { id } = ctx.query;
    const session = await getSession({ ctx });
    const holiday = await prisma.holiday.findFirst({
        where: {
            id: id as string,
            userId: session?.user.id,
        },
        include: {
            photos: true
        }
    });
    if (holiday === null || session === null) {
        ctx.res.setHeader('Location', '/404');
        ctx.res.statusCode = 302;
        ctx.res.end();
        return { props: {} };
    }
    const photos: HolidayPhotoViewModel[] = [];

    for (const photo of holiday.photos) {
        const key = s3FilePathResolver(
            photo.photoFileName,
            session.user.id
        );
        photos.push({
            ...photo,
            uploadedAt: photo.uploadedAt.toISOString(),
            photoUrl: await getS3ImageUrl(key),
        });
    }
    if (photos.length === 0) {
        photos.push({
            id: "default",
            photoUrl: "/default.jpeg",
            isCoverPhoto: true,
            holidayId: holiday.id,
            userId: session.user.id,
            photoFileName: "Default",
            uploadedAt: new Date().toISOString(),
        });
    }

    const holidayViewModel: HolidayWithPhotoViewModel = {
        ...holiday,
        photos,
        visitedAt: holiday.visitedAt.toISOString(),
        loggedAt: holiday.visitedAt.toISOString(),
    }
    return {
        props: {
            holiday: holidayViewModel
        }
    }
}, '/scrapbook');

type Props = {
    holiday: HolidayWithPhotoViewModel;
}

const ViewHoliday: NextPage<Props> = ({ holiday }) => {
    const hasPhotos = holiday.photos.length > 0;
    const hasDescription = holiday.description.length > 0;
    return (
        <>
            <div className="flex flex-col space-y-4">
                <BackButton />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 dark:text-white">
                            <CardTitle className="text-sm font-medium">
                                Holiday
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='dark:text-white'>
                            <div className="text-2xl font-bold">{holiday.title}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 dark:text-white">
                            <CardTitle className="text-sm font-medium">
                                Destination
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='dark:text-white'>
                            <div className="text-2xl font-bold">{holiday.locationAddress}</div>
                            <p className="text-xs text-muted-foreground">
                                Lat: {holiday.locationLat} Long: {holiday.locationLng}
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="sm:col-span-2 md:col-span-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 dark:text-white">
                            <CardTitle className="text-sm font-medium">
                                Visited On
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='dark:text-white'>
                            <div className="text-2xl font-bold">{dayjs(holiday.visitedAt).format('MMMM D YYYY')}</div>
                            <p className="text-xs text-muted-foreground">
                                {dayjs(holiday.visitedAt).fromNow()}
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {
                        holiday.description.length > 0 && (
                            <Card className={cn("col-span-2", hasPhotos ? 'md:col-span-1' : 'md:col-span-2')}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 dark:text-white">
                                    <CardTitle className="text-sm font-medium">
                                        Description
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className='dark:text-white'>
                                    <div className="text-md font-bold text-muted-foreground">{holiday.description}</div>
                                </CardContent>
                            </Card>
                        )
                    }
                    {
                        holiday.photos.length > 0 && (
                            <Card className={cn("col-span-2", hasDescription ? 'md:col-span-1' : 'md:col-span-2')}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 dark:text-white">
                                    <CardTitle className="text-sm font-medium">
                                        Photos
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className='dark:text-white'>
                                    <div className="flex flex-row space-x-2 mt-4">
                                        {
                                            holiday.photos.map((x, index) => (
                                                <PhotoPreview isCoverPhoto={holiday.coverPhotoId ? holiday.coverPhotoId === x.id : index === 0} key={index} src={x.photoUrl} />
                                            ))
                                        }
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    }
                </div>
                <GoogleMapsComponent position="center">
                    <Map holidays={[holiday]} height={350} center={{ lat: holiday.locationLat, lng: holiday.locationLng }} zoom={7} />
                </GoogleMapsComponent>
            </div>
        </>
    )
};

export default ViewHoliday;