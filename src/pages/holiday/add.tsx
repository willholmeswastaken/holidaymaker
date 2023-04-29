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
import { useRouter } from "next/router";
import GoogleMapsComponent from "@/components/google-maps-component";
import ErrorLabel from "@/components/ui/errorLabel";
import { useMemo } from "react";
import { toast } from "@/hooks/use-toast";
import PhotoPreview from "@/components/photo-preview";

export const getServerSideProps = requireAuth(undefined, 'add-holiday');

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

const AddHoliday: NextPage = () => {
    const router = useRouter();
    const createHolidayMutation = api.holiday.createHoliday.useMutation();
    const { register, handleSubmit, formState: { errors }, control, setValue } = useForm<HolidayInputs>({
        defaultValues: {
            visitedAt: new Date().toISOString(),
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
    })
    const isLoading = useMemo<boolean>(() => createHolidayMutation.isLoading || uploadPhotoMutation.isLoading, [createHolidayMutation.isLoading, uploadPhotoMutation.isLoading]);

    const onSubmit: SubmitHandler<HolidayInputs> = async data => {
        const holidayId = await createHolidayMutation.mutateAsync(data);

        if (createHolidayMutation.isError) return;

        if (!data.photos) await router.push('/scrapbook');

        for (const photo of data.photos || []) {
            await uploadPhotoMutation.mutateAsync({ photo, holidayId });
        }

        toast({
            title: "Holiday created",
            description: "You can view this holiday in your scrapbook now.",
            variant: "default",
        });
        await router.push('/scrapbook');
    };
    return (
        <>
            <Header className="pb-4 text-slate-800">Add Holiday</Header>
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
                            <Label htmlFor="description">Date Visited</Label>
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
                            <Label htmlFor="description">Photo</Label>
                            <input type="file" className="text-white" {...register("photos")} multiple accept="image/*" />
                            {errors.photos && <ErrorLabel>This field is required</ErrorLabel>}
                            <Controller
                                name="photos"
                                control={control}
                                render={({ field }) => {
                                    const setCoverPhoto = (file: File) => {
                                        if (field.value) {
                                            field.onChange([file, ...Array.from(field.value).filter(f => f !== file)])
                                        } else {
                                            field.onChange([file]);
                                        }
                                    }
                                    return (
                                        <div className="flex flex-wrap gap-2">
                                            {field.value &&
                                                Array.from(field.value).map((file, index) => (
                                                    <PhotoPreview isCoverPhoto={index === 0} setIsCoverPhoto={setCoverPhoto} key={index} file={file} />
                                                ))}
                                        </div>
                                    )
                                }}
                            />
                        </div>


                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {
                                isLoading
                                    ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    )
                                    : 'Create'
                            }
                        </Button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default AddHoliday;
