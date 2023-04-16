import Link from 'next/link';
import Image from 'next/image';

function Footer() {
    return (
        <footer className='pt-4'>
            <div className="max-w-6xl mx-auto px-4 sm:px-6">

                {/* Top area: Blocks */}
                <div className="grid sm:grid-cols-12 gap-8 py-8 md:py-12 border-t border-gray-200 dark:border-none">

                    {/* 1st block */}
                    <div className="sm:col-span-12 lg:col-span-3">
                        <div className="mb-2">
                            {/* Logo */}
                            <Link href='/' className="inline-block" aria-label="Cruip">
                                <div className="w-8 h-8">
                                    <Image
                                        src="/logo.jpeg"
                                        alt='Holiday maker logo'
                                        width={100}
                                        height={100}
                                        className='object-contain rounded-full' />
                                </div>
                            </Link>
                        </div>
                        <div className="text-sm text-gray-600">
                            <Link href='/' className="text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-300 hover:underline transition duration-150 ease-in-out">Terms</Link> · <Link href='/' className="text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-300 hover:underline transition duration-150 ease-in-out">Privacy Policy</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;