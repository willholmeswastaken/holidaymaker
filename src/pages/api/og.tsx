import { ImageResponse } from '@vercel/og';
import { type NextRequest } from 'next/server';

export const config = {
  runtime: 'experimental-edge',
};

const ogImageHandler = (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || 'HolidayMaker'
  return new ImageResponse(
    (
      <div tw="h-full w-full flex items-start justify-start bg-sky-50">
        <div tw="flex items-start justify-start h-full">
          <div tw="flex flex-col justify-center items-center px-20 w-full h-full text-center">
            <p tw="text-[120px] mx-auto text-center font-bold mb-0">
              🏝️
            </p>
            <h1 tw="text-[60px] font-bold">{title}</h1>
            <h1 tw="text-[20px]">Holidays are meant to be enjoyed. We help you capture the moments that matter.</h1>
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