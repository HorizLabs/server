import { ImageResponse } from '@vercel/og';
import { NextApiRequest } from 'next';
import styles from '@/styles/content/Card.module.css'

export const config = {
  runtime: 'edge',
};
 
export default async function (params: NextApiRequest) {
  let credentials = []
  for (let i in await params.nextUrl.search.split('?')[1].split('&')) {
    let info = await params.nextUrl.search.split('?')[1].split('&')[i]
    credentials.push(info.split('=')[1].split('+').toString().replace(',',' '))
  }
  let host_domain = await params.nextUrl.host

  return new ImageResponse(
    (
      <div className={styles.image}
        style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <image  />
        <p>Hello, {credentials[0]}!</p>
        <p>You will need to log into your testing platform, which uses Horizon. The URL to go to on the application is</p>
        <p>{host_domain}</p>
      </div>
    ),
    {
      width: 1200,
      height: 600,
    },
  );
}