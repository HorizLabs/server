import { ImageResponse } from '@vercel/og';
import { NextApiRequest } from 'next';

export const config = {
  runtime: 'edge',
};
 
export default async function (params: NextApiRequest) {
  try {
    let credentials = []
    // @ts-ignore
    for (let i in await params.nextUrl.search.split('?')[1].split('&')) {
      // @ts-ignore
      let info = await params.nextUrl.search.split('?')[1].split('&')[i]
      credentials.push(info.split('=')[1].split('+').toString().replace(',',' '))
    }
    // @ts-ignore
    let host_domain = await params.nextUrl.host
    // @ts-ignore
    let origin = await params.nextUrl.origin
    // Make this downloadable
    const image = new ImageResponse(
      (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: 'white',
          justifyContent: 'center',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
          }}>
            <img src={`${origin}/logo.png`} alt='logo' width={50} height={50} />
            <h2>Hello, {credentials[0]}!</h2>
          </div>
  
          <p>Today is the day that you will be taking your test on the Horizon platform.</p>
          <p style={{
            fontSize: '15px',
          }}>Once you are ready, you will need to open the Horizon app on your testing device and put this URL in when prompted:</p>
          <p style={{
             backgroundColor: 'gray',
              color: 'white',
              borderRadius: '10px',
              padding: '10px',
          }}>{host_domain}</p>
          <p>Once you have entered that URL and have clicked enter, you will be prompted to enter your credentials:</p>
          <div style={{
            display: 'flex',
          }}>
            <p style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
            }}>Username: <span style={{
              backgroundColor: 'gray',
              color: 'white',
              borderRadius: '10px',
              padding: '10px',
            }}>{credentials[1]}</span></p>
            <p style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              marginLeft: '20px',
            }}>Password: <span style={{
              backgroundColor: 'gray',
              color: 'white',
              borderRadius: '10px',
              padding: '10px',
            }}>{credentials[2]}</span></p>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 600,
      },
    );
    image.headers.set('Content-Disposition', `attachment; filename=${credentials[0].replace(/s/g, '')}_access_card.png`)
    return image;
  } catch (e) {
    return new ImageResponse(
       <div style={{
          display: 'flex',}}>
          <h1>There was an error</h1>
          <p>Could not generate the content.</p>
          </div>
      )
  }
}