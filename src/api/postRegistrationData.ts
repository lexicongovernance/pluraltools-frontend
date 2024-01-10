import {
  PostRegistrationDataRequest,
  PostRegistrationDataResponse,
} from '../types/RegistrationDataType';

async function postRegistrationData({
  body,
  eventId,
}: {
  eventId: string;
  body: PostRegistrationDataRequest;
}): Promise<PostRegistrationDataResponse | null> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/events/${eventId}/registration`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const res = (await response.json()) as { data: PostRegistrationDataResponse };
    return res.data;
  } catch (error) {
    console.error('Error fetching nonce:', error);
    return null;
  }
}

export default postRegistrationData;
