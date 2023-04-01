import { type HolidayWithPhoto } from '@/types/HolidayWithPhoto';
import { InfoWindowF } from '@react-google-maps/api';

type MarkerWindow = {
    holiday: HolidayWithPhoto;
    onMarkerClose: () => void;
}

const MarkerWindow = ({ holiday, onMarkerClose }: MarkerWindow) => {
    return (
        <InfoWindowF
            position={{ lat: holiday.locationLat, lng: holiday.locationLng }}
            onCloseClick={onMarkerClose}
        >
            <div>{holiday.title}</div>
        </InfoWindowF>
    )
}

export default MarkerWindow