import { ImageResponse } from '@vercel/og';
import { type NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

const ogImageHandler = (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || 'HolidayMaker'
  return new ImageResponse(
    (
      <div
        tw="h-full w-full flex items-start justify-start bg-white"
      >
        <div tw="flex items-start justify-start h-full">
          <div tw="flex flex-col justify-between w-full h-full p-20">
            <p style={{
              backgroundImage: 'linear-gradient(90deg, rgb(255, 77, 77), rgb(249, 203, 40))',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontSize: '55px',
              fontWeight: 'bold'
            }}>
              🏝️ HolidayMaker
            </p>
            <div tw="flex flex-col">
              <div
                style={{
                  backgroundImage: 'linear-gradient(90deg, rgb(255, 77, 77), rgb(249, 203, 40))',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  fontSize: '55px',
                  fontWeight: 'bold'
                }}
              >
                {title}
              </div>
              <div
                style={{
                  backgroundImage: 'linear-gradient(90deg, rgb(0, 124, 240), rgb(0, 223, 216))',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  fontSize: '30px',
                  fontWeight: 'bold'
                }}
              >
                Holidays are meant to be enjoyed. We help you capture the moments that matter.
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}

export default ogImageHandler;