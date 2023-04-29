import Header from "@/components/ui/header";
import { prisma } from "@/server/db";
import { type HolidayPhotoViewModel, type HolidayWithPhotoViewModel } from "@/types/HolidayWithPhoto";
import { getS3ImageUrl } from "@/utils/getS3ImageUrl";
import { requireAuth } from "@/utils/requireAuth";
import { s3FilePathResolver } from "@/utils/s3FilePathResolver";
import { type NextPage } from "next";
import { getSession } from "next-auth/react";
import dayjs from 'dayjs';
import PhotoPreview from "@/components/photo-preview";

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

    return (
        <>
            <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col dark:bg-slate-800 rounded-xl p-4">
                    <Header className="text-slate-800 dark:text-white">{holiday.title}</Header>
                </div>
                <div className="flex flex-col bg-gray-200 dark:bg-slate-800 rounded-xl p-4">
                    <Header className="text-slate-800 dark:text-white">Travelled To</Header>
                    <span className="dark:text-white">{holiday.locationAddress}</span>
                </div>
                <div className="flex flex-col bg-gray-200 dark:bg-slate-800 rounded-xl p-4">
                    <Header className="text-slate-800 dark:text-white">Visited On</Header>
                    <span className="dark:text-white">{dayjs(holiday.visitedAt).format('MMMM D YYYY')}</span>
                </div>
                {
                    holiday.description.length > 0 && (
                        <div className="flex flex-col bg-gray-200 dark:bg-slate-800 rounded-xl p-4 col-span-3">
                            <Header className="text-slate-800 dark:text-white">Description</Header>
                            <span className="dark:text-white">{holiday.description}</span>
                        </div>
                    )
                }
                {
                    holiday.photos.length > 0 && (
                        <div className="flex flex-col bg-slate-800 rounded-xl p-4 col-span-3">
                            <Header className="text-slate-800 dark:text-white">Photos</Header>
                            <div className="flex flex-row space-x-2 mt-4">
                                {
                                    holiday.photos.map((x, index) => (
                                        <PhotoPreview isCoverPhoto={holiday.coverPhotoId ? holiday.coverPhotoId === x.id : index === 0} key={index} src={x.photoUrl} />
                                    ))
                                }
                            </div>
                        </div>
                    )
                }
            </div>
        </>
    )
};

export default ViewHoliday;