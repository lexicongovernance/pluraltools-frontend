import { PostRegistrationRequest, PostRegistrationResponse } from './types';

export async function postRegistration({
  body,
}: {
  body: PostRegistrationRequest;
}): Promise<PostRegistrationResponse | null> {
  try {
    const response = await fetch(`${process.env.VITE_SERVER_URL}/api/registrations`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const res = (await response.json()) as { data: PostRegistrationResponse };
    return res.data;
  } catch (error) {
    console.error('Error updating registration:', error);
    return null;
  }
}
