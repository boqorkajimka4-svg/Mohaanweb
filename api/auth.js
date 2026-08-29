import supabase from './db-client.js';

function getBearerToken(req) {
  const auth =
    req.headers?.authorization ||
    req.headers?.Authorization ||
    '';

  if (!auth) return null;

  const match = auth.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

export async function verifyAdmin(req) {
  try {
    const token = getBearerToken(req);

    if (!token) {
      console.error('verifyAdmin: missing Authorization bearer token');
      return null;
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error) {
      console.error('verifyAdmin: Supabase getUser failed:', error.message);
      return null;
    }

    if (!user) {
      console.error('verifyAdmin: token produced no user');
      return null;
    }

    return user;
  } catch (err) {
    console.error(
      'verifyAdmin exception:',
      err instanceof Error ? err.message : String(err)
    );
    return null;
  }
}
