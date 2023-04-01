import { useLoadScript, GoogleMap, MarkerF } from "@react-google-maps/api";
import { env } from "@/env.mjs";
import { useState, useMemo } from "react";
import MarkerWindow from "./marker-window";
import { type HolidayWithPhoto } from "@/types/HolidayWithPhoto";

type Libraries = ("drawing" | "geometry" | "localContext" | "places" | "visualization")[];

type MapProps = {
    holidays: HolidayWithPhoto[];
}
export const Map = ({ holidays }: MapProps) => {
    const [selectedMarker, setSelectedMarker] = useState<HolidayWithPhoto | null>(null);
    const libraries = useMemo<Libraries>(() => ["places"], []);
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

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        libraries: libraries,
    });

    const onMarkerOpen = (holiday: HolidayWithPhoto) => {
        setSelectedMarker(holiday);
    };

    const onMarkerClose = () => {
        setSelectedMarker(null);
    };

    if (!isLoaded) {
        return <p>Loading...</p>;
    }

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