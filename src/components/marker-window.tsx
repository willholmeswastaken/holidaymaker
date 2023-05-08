import { type HolidayWithPhotoViewModel } from '@/types/HolidayWithPhoto';
import { InfoWindowF } from '@react-google-maps/api';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import Image from 'next/image';
import { HolidayOperations } from './holiday-operations';
import Link from 'next/link';

type MarkerWindow = {
    holiday: HolidayWithPhotoViewModel;
    onMarkerClose: () => void;
}

const MarkerWindow = ({ holiday, onMarkerClose }: MarkerWindow) => {
    const coverPhoto = useMemo(() => {
        return holiday.photos.find(photo => photo.isCoverPhoto);
    }, [holiday.photos]);
    return (
        <InfoWindowF
            position={{ lat: holiday.locationLat, lng: holiday.locationLng }}
            onCloseClick={onMarkerClose}
        >
            <div className="flex flex-row space-x-2 p-2">
                <div className="relative w-24 h-24 rounded-md overflow-hidden cursor-pointer transition-all hover:scale-105">
                    <Image
                        src={coverPhoto?.photoUrl as string}
                        alt={`Holiday photo for ${holiday.title}`}
                        fill
                        sizes="sizes='(max-width: 100) 100vw'"
                        className='object-cover'
                        placeholder='blur'
                        blurDataURL='/loading.png'
                    />
                </div>

                <div className='flex flex-col'>
                    <Link href={`/holiday/${holiday.id}`} className='text-blue-500 underline font-semibold'>{holiday.title}</Link>
                    <p className='text-slate-400 text-xs'>{holiday.locationAddress}</p>
                    <p className='text-slate-500 text-xs'>{dayjs(holiday.visitedAt).format('MMMM D YYYY')}</p>
                    <div className="flex flex-row space-x-2 mt-2 justify-end">
                        <HolidayOperations holiday={holiday} onHolidayRemoved={onMarkerClose} />
                    </div>
                </div>
            </div>
        </InfoWindowF>
    )
}

export default MarkerWindow