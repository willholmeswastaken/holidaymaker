import { type HolidayWithPhotoViewModel } from '@/types/HolidayWithPhoto';
import { useMemo } from 'react';
import Image from 'next/image';
import { HolidayOperations } from './holiday-operations';
import dayjs from 'dayjs'

type Props = {
    holiday: HolidayWithPhotoViewModel;
}

const HolidayPanel = ({ holiday }: Props) => {
    const coverPhoto = useMemo(() => {
        return holiday.photos.find(photo => photo.isCoverPhoto);
    }, [holiday.photos]);
    return (
        <div className="flex flex-row justify-center items-center border dark:border-slate-700 p-3 rounded-xl">
            <div className="relative w-24 h-24 rounded-md overflow-hidden cursor-pointer transition-all hover:scale-105">
                <Image
                    src={coverPhoto?.photoUrl as string}
                    alt={`Holiday photo for ${holiday.title}`}
                    fill
                    className='object-cover'
                    placeholder='blur'
                    blurDataURL='/loading.png'
                />
            </div>
            <div className="flex flex-col px-4 flex-1">
                <p className='text-slate-900 dark:text-white'>{holiday.title}</p>
                <p className='text-slate-400 text-md'>{holiday.locationAddress}</p>
                <p className='text-slate-500 text-sm'>{dayjs(holiday.visitedAt).format('MMMM D YYYY')}</p>
            </div>
            <HolidayOperations holiday={holiday} />
        </div>
    )
}

export default HolidayPanel