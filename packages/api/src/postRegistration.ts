import { ApiRequest, PostRegistrationRequest, PostRegistrationResponse } from './types';

export async function postRegistration({
  body,
  serverUrl,
}: ApiRequest<{
  body: PostRegistrationRequest;
}>): Promise<PostRegistrationResponse | null> {
  try {
    const response = await fetch(`${serverUrl}/api/registrations`, {
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
