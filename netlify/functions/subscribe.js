exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let email;
  try {
    email = JSON.parse(event.body).email;
  } catch {
    return { statusCode: 400, body: 'Invalid request' };
  }

  if (!email) {
    return { statusCode: 400, body: 'Email requerido' };
  }

  const PUBLICATION_ID = 'pub_a1f61e80-7e76-4836-996b-12191b15e289';
  const API_KEY = process.env.BEEHIIV_API_KEY;

  try {
    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${PUBLICATION_ID}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          email,
          reactivate_existing: false,
          send_welcome_email: true
        })
      }
    );

    if (!res.ok) {
      return { statusCode: 500, body: 'Error al suscribir' };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true })
    };
  } catch {
    return { statusCode: 500, body: 'Error interno' };
  }
};
