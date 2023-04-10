import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";

export const PlacesAutocomplete = ({
    onAddressSelect,
    address
}: {
    onAddressSelect?: (address: string, lat: number, lng: number) => void;
    address?: string;
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
        defaultValue: address || undefined
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
                    className="cursor-pointer mb-1 w-full text-gray-700 px-3 py-2 border border-slate-300 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900 bg-transparent  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent focus:ring-offset-2 rounded-md"
                    onClick={() => {
                        setValue(description, false);
                        clearSuggestions();
                        void getGeocode({ address: description }).then((results) => {
                            const { lat, lng } = getLatLng(results[0]!);
                            console.log("📍 Coordinates: ", { lat, lng });
                            onAddressSelect && onAddressSelect(description, lat, lng);
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
                className='w-full text-gray-700 px-3 py-2 border border-slate-300 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900 bg-transparent  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent focus:ring-offset-2 rounded-md'
                disabled={!ready}
                onChange={(e) => setValue(e.target.value)}
                placeholder="10 Downing Street"
            />

            {status === 'OK' && (
                <ul className='mt-4 mx-auto px-4 list-none overflow-x-hidden block w-[96%]'>{renderSuggestions()}</ul>
            )}
        </div>
    );
};