import { GoogleMap, MarkerF } from "@react-google-maps/api";
import { useState, useMemo } from "react";
import MarkerWindow from "./marker-window";
import { type HolidayWithPhotoViewModel } from "@/types/HolidayWithPhoto";

type MapLatLng = {
    lat: number;
    lng: number;
}

type MapProps = {
    holidays: HolidayWithPhotoViewModel[];
    height?: number;
    center?: MapLatLng;
    zoom?: number;
}
export const Map = ({ holidays, height, center, zoom }: MapProps) => {
    const [selectedMarker, setSelectedMarker] = useState<HolidayWithPhotoViewModel | null>(null);
    const mapCenter = useMemo<MapLatLng>(
        () => center ?? ({ lat: 26.672932021393862, lng: 85.31184012689732 }),
        [center]
    );

    const mapOptions = useMemo<google.maps.MapOptions>(
        () => ({
            disableDefaultUI: false,
            clickableIcons: true,
            scrollwheel: false
        }),
        []
    );

    const onMarkerOpen = (holiday: HolidayWithPhotoViewModel) => {
        setSelectedMarker(holiday);
    };

    const onMarkerClose = () => {
        setSelectedMarker(null);
    };

    return (
        <div className="flex justify-center items-center">
            <GoogleMap
                options={mapOptions}
                zoom={zoom ?? 2}
                center={mapCenter}
                mapTypeId={google.maps.MapTypeId.ROADMAP}
                mapContainerStyle={{ width: '100%', height: `${height ?? 650}px` }}
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