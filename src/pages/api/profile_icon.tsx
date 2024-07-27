import { ImageResponse } from '@vercel/og';
import { NextApiRequest } from 'next';

export const config = {
  runtime: 'edge',
};
 
export default async function (params: NextApiRequest) {
  let credentials = []
  // @ts-ignore
  for (let i in await params.nextUrl.search.split('?')[1].split('&')) {
    // @ts-ignore
    let info = await params.nextUrl.search.split('?')[1].split('&')[i]
    credentials.push(info.split('=')[1].split('+').join(' '))
  }
  let name = credentials[0]
  const image = new ImageResponse(
    (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(34deg, rgba(85,77,232,1) 38%, rgba(79,0,255,1) 100%)',
        color: 'white',
        justifyContent: 'center',
        fontSize: 100
      }}>
        <p>{name}</p>
      </div>
    ),
    {
      width: 500,
      height: 500,
    },
  );
  return image;
}