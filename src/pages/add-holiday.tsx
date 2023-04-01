/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from "next";
import { useForm, type SubmitHandler } from "react-hook-form";

import Header from "@/components/ui/header";
import { requireAuth } from "@/utils/requireAuth";

export const getServerSideProps = requireAuth(undefined, '/add-holiday');

type Inputs = {
    example: string,
    exampleRequired: string,
};

type HolidayInputs = {
    title: string;
    description: string;
    visitedAt: string;
    locationAddress: string;
    locationLat: number;
    locationLng: number;
    photos: File[];
};

const Scrapbook: NextPage = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = data => console.log(data);

    console.log(watch("example")) // watch input value by passing the name of it
    return (
        <>
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20">
                <Header className="pb-4">Add Holiday</Header>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* register your input into the hook by invoking the "register" function */}
                    <input defaultValue="test" {...register("example")} />

                    {/* include validation with required or other standard HTML validation rules */}
                    <input {...register("exampleRequired", { required: true })} />
                    {/* errors will return when field validation fails  */}
                    {errors.exampleRequired && <span>This field is required</span>}

                    <input type="submit" />
                </form>
            </div>

        </>
    );
};

export default Scrapbook;
