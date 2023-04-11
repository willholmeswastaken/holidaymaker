import { type HolidayWithPhotoViewModel } from '@/types/HolidayWithPhoto'
import HolidayPanel from './holiday-panel'

type Props = {
    holidays: HolidayWithPhotoViewModel[]
}

const HolidaysList = ({ holidays }: Props) => {
    return (
        <div className='flex flex-col space-y-4'>
            {holidays.map(holiday => (
                <HolidayPanel key={holiday.id} holiday={holiday} />
            ))}
        </div>
    )
}

export default HolidaysList