/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from "next";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from 'lucide-react';

import Header from "@/components/ui/header";
import { requireAuth } from "@/utils/requireAuth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CustomDatePicker } from "@/components/ui/datepicker";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PlacesAutocomplete } from "@/components/places-autocomplete";
import { api } from "@/utils/api";
import GoogleMapsComponent from "@/components/google-maps-component";
import ErrorLabel from "@/components/ui/errorLabel";
import { useMemo } from "react";
import { toast } from "@/hooks/use-toast";
import PhotoPreview from "@/components/photo-preview";
import { BackButton } from "@/components/back-button";
import { getSession } from "next-auth/react";
import { prisma } from "@/server/db";
import { type HolidayWithPhotoViewModel } from "@/types/HolidayWithPhoto";
import { Skeleton } from "@/components/ui/skeleton";
import Seo from "@/components/seo";

export const getServerSideProps = requireAuth(async (ctx) => {
    const { id } = ctx.query;
    const session = await getSession({ ctx });
    const holiday = await prisma.holiday.findFirst({
        where: {
            id: id as string,
            userId: session?.user.id,
        }
    });
    if (holiday === null || session === null) {
        ctx.res.setHeader('Location', '/404');
        ctx.res.statusCode = 302;
        ctx.res.end();
        return { props: {} };
    }

    const holidayViewModel: HolidayWithPhotoViewModel = {
        ...holiday,
        photos: [],
        visitedAt: holiday.visitedAt.toISOString(),
        loggedAt: holiday.visitedAt.toISOString(),
    }

    return {
        props: {
            holiday: holidayViewModel
        }
    }
}, 'add-holiday');

type Props = {
    holiday: HolidayWithPhotoViewModel;
}

type HolidayInputs = {
    title: string;
    description: string;
    visitedAt: string;
    locationAddress: string;
    locationLat: number;
    locationLng: number;
    photos?: FileList;
};

type UploadHolidayPhotoProps = {
    photo: File;
    holidayId: string;
};

const EditHoliday: NextPage<Props> = ({ holiday }) => {
    const getHolidayPhotos = api.holiday.getHolidayPhotos.useQuery({ holidayId: holiday.id });
    const editHolidayMutation = api.holiday.editHoliday.useMutation();
    const updateCoverPhotoMutation = api.holiday.setCoverPhoto.useMutation({
        onError: () => {
            toast({
                title: "Cover photo update failed!",
                description: 'Failed to update the cover photo, please try again.',
                variant: "destructive",
            });
        },
        onSuccess: async () => {
            await getHolidayPhotos.refetch();
            toast({
                title: "Cover photo updated",
                description: "Your cover photo was updated successfully.",
                variant: "default",
            });
        }
    });
    const removePhotoMutation = api.holiday.removePhoto.useMutation({
        onError: () => {
            toast({
                title: "Photo removal failed!",
                description: 'Failed to remove the photo, please try again.',
                variant: "destructive",
            });
        },
        onSuccess: async () => {
            await getHolidayPhotos.refetch();
            toast({
                title: "Photo removed",
                description: "Your seleced photo was removed successfully.",
                variant: "default",
            });
        }
    });
    const uploadPhotoMutation = useMutation({
        mutationFn: ({ photo, holidayId }: UploadHolidayPhotoProps) => {
            const formData = new FormData();
            formData.append('file', photo);
            return fetch(`/api/upload-photo?holidayId=${encodeURIComponent(holidayId)} `, {
                method: 'POST',
                body: formData,
            });
        },
        onSuccess: (data) => {
            if (!data.ok) {
                toast({
                    title: "Image upload failed",
                    description: "Your holiday was created but the image upload failed. Please try again later.",
                    variant: "destructive",
                });
            }
        }
    });
    const { register, handleSubmit, formState: { errors }, control, setValue } = useForm<HolidayInputs>({
        defaultValues: {
            ...holiday,
            photos: undefined
        }
    });
    const isLoading = useMemo<boolean>(() =>
        editHolidayMutation.isLoading ||
        uploadPhotoMutation.isLoading,
        [editHolidayMutation.isLoading, uploadPhotoMutation.isLoading]
    );

    const onSubmit: SubmitHandler<HolidayInputs> = async data => {
        await editHolidayMutation.mutateAsync({ id: holiday.id, ...data });

        if (editHolidayMutation.isError) return;

        const uploads: Promise<unknown>[] = [];
        for (const photo of data.photos || []) {
            uploads.push(uploadPhotoMutation.mutateAsync({ photo, holidayId: holiday.id }));
        }
        await Promise.all(uploads);

        toast({
            title: "Holiday Updated",
            description: `Holiday (${data.title}) has been updated. You can view it in your scrapbook.`,
            variant: "default",
        });
        await getHolidayPhotos.refetch();
        setValue('photos', undefined);
    };

    const setCoverPhoto = async (photoId: string) => {
        await updateCoverPhotoMutation.mutateAsync({ holidayId: holiday.id, id: photoId });
    };

    const removePhoto = async (photoId: string) => {
        await removePhotoMutation.mutateAsync({ holidayId: holiday.id, id: photoId });
    }
    return (
        <>
            <Seo
                title={`HolidayMaker - ${holiday.title}`}
                description={`You travelled to ${holiday.locationAddress}. Click to view more!`}
                image={`https://holidaymaker.vercel.app/api/og?title=${encodeURIComponent(holiday.title)}`}
            />
            <BackButton />
            <Header className="pb-4 text-slate-800 mt-4">Edit Holiday</Header>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-row">
                    <div className="flex flex-col gap-y-4 flex-1">
                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" {...register("title", { required: true })} />
                            {errors.title && <ErrorLabel>This field is required</ErrorLabel>}
                        </div>

                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" {...register("description")} />
                            {errors.description && <ErrorLabel>This field is required</ErrorLabel>}
                        </div>

                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="visitedAt">Date Visited</Label>
                            <Controller
                                control={control}
                                name="visitedAt"
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <CustomDatePicker
                                        id="visitedAt"
                                        selectedDate={field.value ? new Date(field.value) : new Date()}
                                        onDateSelected={(date) => field.onChange(date.toISOString())}
                                    />
                                )}
                            />
                            {errors.visitedAt && <ErrorLabel>This field is required</ErrorLabel>}
                        </div>

                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="locationAddress">Location</Label>
                            <Controller
                                control={control}
                                name="locationAddress"
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <GoogleMapsComponent position="left">
                                        <PlacesAutocomplete
                                            address={field.value}
                                            onAddressSelect={(selectedLocation, selectedLocationLat, selectedLocationLng) => {
                                                field.onChange(selectedLocation);
                                                setValue('locationLat', selectedLocationLat);
                                                setValue('locationLng', selectedLocationLng);
                                            }}
                                        />
                                    </GoogleMapsComponent>
                                )}
                            />
                            {errors.locationAddress && <ErrorLabel>This field is required</ErrorLabel>}
                        </div>

                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="photos">Photos</Label>
                            <input type="file" className="text-white" {...register("photos")} multiple accept="image/*" />
                            {errors.photos && <ErrorLabel>This field is required</ErrorLabel>}
                            <Controller
                                name="photos"
                                control={control}
                                render={({ field }) => {
                                    return (
                                        <div className="flex flex-wrap gap-2">
                                            {field.value &&
                                                Array.from(field.value).map((file, index) => (
                                                    <PhotoPreview key={index} file={file} />
                                                ))}
                                        </div>
                                    )
                                }}
                            />
                        </div>
                        {
                            getHolidayPhotos.data && getHolidayPhotos.data.length > 0 && (
                                <div className="flex flex-col gap-2">
                                    <Label>Existing Photos</Label>
                                    <div className="flex flex-row gap-2">
                                        {
                                            !removePhotoMutation.isLoading && !getHolidayPhotos.isLoading
                                                ? getHolidayPhotos.data.map((photo, index) => (
                                                    <PhotoPreview isCoverPhoto={photo.isCoverPhoto} removePhotoById={removePhoto} setIsCoverPhotoById={setCoverPhoto} id={photo.id} key={index} src={photo.photoUrl} />
                                                ))
                                                : (
                                                    <Skeleton className="h-24 w-24" />
                                                )
                                        }
                                    </div>
                                </div>
                            )
                        }



                        <Button type="submit" className="w-full dark:text-white" variant='outline' disabled={isLoading}>
                            {
                                isLoading
                                    ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    )
                                    : 'Update'
                            }
                        </Button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default EditHoliday;
