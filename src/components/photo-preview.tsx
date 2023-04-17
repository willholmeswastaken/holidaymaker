import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { DialogClose } from '@radix-ui/react-dialog';
import Image from 'next/image';
import clsx from 'clsx';

type PhotoPreviewProps = {
    file: File;
    isCoverPhoto: boolean;
    setIsCoverPhoto: (file: File) => void;
};

const PhotoPreview = ({ file, isCoverPhoto, setIsCoverPhoto }: PhotoPreviewProps) => {
    const [src, setSrc] = useState('');

    useEffect(() => {
        const imageUrl = URL.createObjectURL(file);
        setSrc(imageUrl);

        return () => {
            URL.revokeObjectURL(imageUrl);
        }
    }, [file]);

    if (!src) return null;

    const onSelectPhoto = () => {
        setIsCoverPhoto(file);
    }

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <button
                        className={clsx("w-24 h-24 relative cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-110", isCoverPhoto && 'border-4 rounded-xl border-green-600')}
                        type='button'>
                        <Image
                            src={src}
                            alt="preview"
                            fill
                            className="object-cover rounded-lg"
                        />
                    </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Photo Preview</DialogTitle>
                        <DialogDescription>
                            <div className="w-full h-[40rem] relative">
                                <Image
                                    src={src}
                                    alt="preview"
                                    fill
                                    className="object-contain w-full h-full" />
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button>Close</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button variant='subtle' onClick={onSelectPhoto}>Set as cover photo</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog >
        </>
    );
};

export default PhotoPreview;
