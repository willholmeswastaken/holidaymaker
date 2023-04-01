import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";

export const PlacesAutocomplete = ({
    onAddressSelect,
}: {
    onAddressSelect?: (address: string) => void;
}) => {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        debounce: 300,
        cache: 86400,
    });

    const renderSuggestions = () => {
        return data.map((suggestion) => {
            const {
                place_id,
                structured_formatting: { main_text, secondary_text },
                description,
            } = suggestion;

            return (
                <li
                    key={place_id}
                    className="py-2 px-4 bg-blue-400 my-1 cursor-pointer"
                    onClick={() => {
                        setValue(description, false);
                        clearSuggestions();
                        onAddressSelect && onAddressSelect(description);
                        void getGeocode({ address: description }).then((results) => {
                            const { lat, lng } = getLatLng(results[0]!);
                            console.log("📍 Coordinates: ", { lat, lng });
                        });
                    }}
                >
                    <strong>{main_text}</strong> <small>{secondary_text}</small>
                </li>
            );
        });
    };

    return (
        <div className='w-full h-full'>
            <input
                value={value}
                className='w-[96%] my-12 mx-auto mt-0 p-[16px] block border border-red-300 border-solid'
                disabled={!ready}
                onChange={(e) => setValue(e.target.value)}
                placeholder="123 Stariway To Heaven"
            />

            {status === 'OK' && (
                <ul className='mx-auto px-4 list-none overflow-x-hidden block w-[96%]'>{renderSuggestions()}</ul>
            )}
        </div>
    );
};