import Head from 'next/head'

interface SeoProps {
    title: string
    description: string
    image: string
    type?: string
}

const Seo = ({ title, description, image, type = 'website' }: SeoProps) => {
    const encodedImageUrl = encodeURI(image);
    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />

            {/* Open Graph */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={encodedImageUrl} />
            <meta property="og:type" content={type} />

            {/* Twitter Card */}
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={encodedImageUrl} />
            <meta name="twitter:card" content="summary_large_image" />
        </Head>
    )
}

export default Seo
