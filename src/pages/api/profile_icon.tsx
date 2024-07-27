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
    let name = info.split('=')[1].split('+')
    for (let i in name) {
      credentials.push(name[i].at(0))
    }
  }
  let name = credentials.join('')
  const image = new ImageResponse(
    (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        background: `linear-gradient(${Math.round(Math.random() * 90)}deg, rgba(${Math.round(Math.random() * 255)},${Math.round(Math.random() * 255)},${Math.round(Math.random() * 255)},1) 38%, rgba(${Math.round(Math.random() * 255)},${Math.round(Math.random() * 255)},${Math.round(Math.random() * 255)},1) 100%)`,
        color: 'white',
        justifyContent: 'center',
        fontSize: 100
      }}>
        <p style={{
          textShadow: '2px 2px black'
        }}>{name}</p>
      </div>
    ),
    {
      width: 500,
      height: 500,
    },
  );
  return image;
}