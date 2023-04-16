import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { DialogClose } from '@radix-ui/react-dialog';

type PhotoPreviewProps = {
    file: File;
};

const PhotoPreview = ({ file }: PhotoPreviewProps) => {
    const [src, setSrc] = useState('');

    useEffect(() => {
        const reader = new FileReader();
        reader.onloadend = () => setSrc(reader.result as string);
        reader.readAsDataURL(file);
    }, [file]);

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <img
                        src={src}
                        alt="preview"
                        className="w-24 h-24 object-cover cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-110"
                    />
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Photo Preview</DialogTitle>
                        <DialogDescription>
                            <img src={src} alt="preview" className="w-full h-full object-cover" />
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button>Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default PhotoPreview;
