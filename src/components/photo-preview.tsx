import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { DialogClose } from '@radix-ui/react-dialog';
import Image from 'next/image';
import clsx from 'clsx';

type PhotoPreviewProps = {
    file?: File;
    src?: string;
    isCoverPhoto?: boolean;
    setIsCoverPhoto?: (file: File) => void;
    setIsCoverPhotoById?: (photoId: string) => void;
    id?: string;
    removePhotoById?: (photoId: string) => void;
};

const PhotoPreview = ({ file, src, isCoverPhoto, setIsCoverPhoto, setIsCoverPhotoById, id, removePhotoById }: PhotoPreviewProps) => {
    const [fileSrc, setFileSrc] = useState('');

    useEffect(() => {
        if (!file) return;
        const imageUrl = URL.createObjectURL(file);
        setFileSrc(imageUrl);

        return () => {
            URL.revokeObjectURL(imageUrl);
        }
    }, [file]);

    if (!fileSrc && !src) return null;

    const onSelectPhoto = () => {
        if (src && id && setIsCoverPhotoById) setIsCoverPhotoById(id);
        else if (file && setIsCoverPhoto) setIsCoverPhoto(file);
    }

    const onRemovePhoto = () => {
        if (id && removePhotoById) removePhotoById(id);
    }

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <button
                        className={clsx("w-24 h-24 relative cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-110", isCoverPhoto && 'border-4 rounded-xl border-green-600')}
                        type='button'>
                        <Image
                            src={src || fileSrc}
                            alt="preview"
                            fill
                            sizes='(max-width: 100px) 100vw'
                            priority
                            className="object-cover rounded-lg"
                            placeholder='blur'
                            blurDataURL='/loading.png'
                        />
                    </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Photo Preview</DialogTitle>
                        <div className="w-full h-[40rem] relative">
                            <Image
                                src={src || fileSrc}
                                alt="preview"
                                fill
                                sizes='(max-width: 640px) 100vw'
                                className="object-contain w-full h-full"
                                placeholder='blur'
                                blurDataURL='/loading.png' />
                        </div>
                    </DialogHeader>
                    <DialogFooter className='mt-[-15px]'>
                        <DialogClose asChild>
                            <Button className='dark:text-white' variant='ghost'>Close</Button>
                        </DialogClose>
                        {
                            !!removePhotoById && (
                                <DialogClose asChild>
                                    <Button className='dark:text-white' variant='destructive' onClick={onRemovePhoto}>Remove photo</Button>
                                </DialogClose>
                            )
                        }
                        {
                            !!(setIsCoverPhoto || setIsCoverPhotoById) && (
                                <DialogClose asChild>
                                    <Button className='dark:text-white' variant='outline' onClick={onSelectPhoto}>Set as cover photo</Button>
                                </DialogClose>
                            )
                        }
                    </DialogFooter>
                </DialogContent>
            </Dialog >
        </>
    );
};

export default PhotoPreview;
