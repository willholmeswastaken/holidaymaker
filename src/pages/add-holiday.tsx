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

export const getServerSideProps = requireAuth(undefined, '/add-holiday');

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

const Scrapbook: NextPage = () => {
    const { register, handleSubmit, formState: { errors }, control, setValue } = useForm<HolidayInputs>({
        defaultValues: {
            visitedAt: new Date().toISOString(),
        }
    });
    const router = useRouter();
    const uploadPhotoMutation = useMutation({
        mutationFn: ({ photo, holidayId }: UploadHolidayPhotoProps) => {
            const formData = new FormData();
            formData.append('file', photo);
            return fetch(`/api/upload-photo?holidayId=${encodeURIComponent(holidayId)} `, {
                method: 'POST',
                body: formData,
            }).then(
                (res) => res.json(),
            )
        },
    })
    const createHoliday = api.holiday.createHoliday.useMutation();
    const isLoading = useMemo<boolean>(() => createHoliday.isLoading || uploadPhotoMutation.isLoading, [createHoliday.isLoading, uploadPhotoMutation.isLoading]);

    const onSubmit: SubmitHandler<HolidayInputs> = async data => {
        console.log('Creating holiday');
        const holidayId = await createHoliday.mutateAsync(data);

        if (createHoliday.isError) return;
        console.log('Holiday Created');

        if (!data.photos) await router.push('/scrapbook');

        for (const photo of data.photos || []) {
            console.log('Uploading photo');
            await uploadPhotoMutation.mutateAsync({ photo, holidayId });
            if (uploadPhotoMutation.isError) {
                console.error('Failed to upload photo!');
                return;
            }
            console.log('Uploaded Photo');
        }
        await router.push('/scrapbook');
    };
    return (
        <>
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20">
                <Header className="pb-4">Add Holiday</Header>
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
                                <Textarea id="description" {...register("description", { required: true })} />
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
                                <Label htmlFor="description">Location</Label>
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
                                {errors.description && <ErrorLabel>This field is required</ErrorLabel>}
                            </div>

                            <div className="flex flex-col gap-y-2">
                                <Label htmlFor="description">Photo</Label>
                                <input type="file" className="text-white" {...register("photos")} multiple />
                                {errors.photos && <ErrorLabel>This field is required</ErrorLabel>}
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
            </div>

        </>
    );
};

export default Scrapbook;
