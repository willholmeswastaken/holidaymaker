import { signIn } from "next-auth/react";

function HeroHome() {
    const onGetStarted = () => {
        void signIn(undefined, { callbackUrl: `${window.location.origin}/scrapbook` });
    }
    return (
        <section className="relative">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                {/* Hero content */}
                <div className="pt-32 pb-12 md:pt-40 md:pb-20">
                    {/* Section header */}
                    <div className="text-center pb-12 md:pb-16">
                        <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4 dark:text-white" data-aos="zoom-y-out">
                            Make your holidays <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">memorable</span>
                        </h1>
                        <div className="max-w-3xl mx-auto">
                            <p className="text-xl text-gray-600 mb-8 dark:text-gray-300" data-aos="zoom-y-out" data-aos-delay="150">
                                Our app allows you to capture the highlights of your trip and share them with your friends and family.
                            </p>
                            <div className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center" data-aos="zoom-y-out" data-aos-delay="300">
                                <div>
                                    <button className="bg-slate-700 hover:bg-slate-600 text-white px-5 py-3 rounded-full duration-200" type='button' onClick={onGetStarted}>Get started</button>
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