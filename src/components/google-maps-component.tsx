import { env } from '@/env.mjs';
import { type Libraries } from '@/types/Libraries';
import { useLoadScript } from '@react-google-maps/api';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

type Props = {
    children: JSX.Element;
    position: 'left' | 'center'
}

const libs: Libraries = ["places"];

const GoogleMapsComponent = ({ children, position }: Props) => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        libraries: libs,
    });

    return isLoaded ? children : <div className={clsx('flex flex-row w-full h-full text-white', position === 'left' ? 'justify-start items-start' : 'justify-center items-center')}>
        <Loader2 className={clsx('mr-2 h-4 w-4 animate-spin', position === 'left' && 'mt-1')} />
        Loading...
    </div>;
}

export default GoogleMapsComponent