import Link from 'next/link';
import React from 'react';

function Footer() {
    return (
        <footer className='pt-4'>
            <div className="max-w-6xl mx-auto px-4 sm:px-6">

                {/* Top area: Blocks */}
                <div className="grid sm:grid-cols-12 gap-8 py-8 md:py-12 border-t border-gray-200">

                    {/* 1st block */}
                    <div className="sm:col-span-12 lg:col-span-3">
                        <div className="mb-2">
                            {/* Logo */}
                            <Link href='/' className="inline-block" aria-label="Cruip">
                                <svg className="w-8 h-8" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <radialGradient cx="21.152%" cy="86.063%" fx="21.152%" fy="86.063%" r="79.941%" id="footer-logo">
                                            <stop stopColor="#4FD1C5" offset="0%" />
                                            <stop stopColor="#81E6D9" offset="25.871%" />
                                            <stop stopColor="#338CF5" offset="100%" />
                                        </radialGradient>
                                    </defs>
                                    <rect width="32" height="32" rx="16" fill="url(#footer-logo)" fillRule="nonzero" />
                                </svg>
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