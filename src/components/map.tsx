import { GoogleMap, MarkerF } from "@react-google-maps/api";
import { useState, useMemo } from "react";
import MarkerWindow from "./marker-window";
import { type HolidayWithPhoto } from "@/types/HolidayWithPhoto";

type MapProps = {
    holidays: HolidayWithPhoto[];
}
export const Map = ({ holidays }: MapProps) => {
    const [selectedMarker, setSelectedMarker] = useState<HolidayWithPhoto | null>(null);
    const mapCenter = useMemo(
        () => ({ lat: 26.672932021393862, lng: 85.31184012689732 }),
        []
    );

    const mapOptions = useMemo<google.maps.MapOptions>(
        () => ({
            disableDefaultUI: false,
            clickableIcons: true,
            scrollwheel: false
        }),
        []
    );

    const onMarkerOpen = (holiday: HolidayWithPhoto) => {
        setSelectedMarker(holiday);
    };

    const onMarkerClose = () => {
        setSelectedMarker(null);
    };

    return (
        <div className="flex justify-center items-center">
            <GoogleMap
                options={mapOptions}
                zoom={2}
                center={mapCenter}
                mapTypeId={google.maps.MapTypeId.ROADMAP}
                mapContainerStyle={{ width: '100%', height: '650px' }}
            >
                {
                    holidays.map((holiday) => (
                        <MarkerF
                            key={holiday.id}
                            position={{ lat: holiday.locationLat, lng: holiday.locationLng }}
                            onClick={() => onMarkerOpen(holiday)}
                        />
                    ))
                }
                {selectedMarker && <MarkerWindow holiday={selectedMarker} onMarkerClose={onMarkerClose} />}
            </GoogleMap>
        </div>
    )
}