import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useMemo } from "react";

function HeroHome() {
    const { data: sessionData, } = useSession();
    const { push } = useRouter();
    const isAuthenticated = useMemo<boolean>(() => sessionData?.user !== null && sessionData?.user !== undefined, [sessionData]);
    const onGetStarted = () => {
        if (isAuthenticated) {
            void push('/scrapbook');
        } else {
            void signIn(undefined, { callbackUrl: `${window.location.origin}/scrapbook` });
        }
    }
    return (
        <section className="relative">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                {/* Hero content */}
                <div className="pt-10 pb-12 md:pb-20">
                    {/* Section header */}
                    <div className="text-center pb-12 md:pb-16">
                        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold leading-tighter tracking-tighter mb-4 dark:text-white" data-aos="zoom-y-out">
                            Holidays <br /> made <br /> <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-400">memorable.</span>
                        </h1>
                        <div className="max-w-3xl mx-auto">
                            <p className="text-xl text-gray-600 mb-8 dark:text-gray-300" data-aos="zoom-y-out" data-aos-delay="150">
                                Holidays are meant to be enjoyed. <br /> We help you capture the moments that matter.
                            </p>
                            <div className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center" data-aos="zoom-y-out" data-aos-delay="300">
                                <div>
                                    <button className="bg-slate-700 hover:bg-slate-600 text-white px-5 py-3 rounded-xl duration-200" type='button' onClick={onGetStarted}>View your scrapbook</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HeroHome;