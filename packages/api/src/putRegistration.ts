import { PutRegistrationRequest, PutRegistrationResponse } from './types';

export async function putRegistration({
  registrationId,
  body,
}: {
  registrationId: string;
  body: PutRegistrationRequest;
}): Promise<PutRegistrationResponse | null> {
  try {
    const response = await fetch(
      `${process.env.VITE_SERVER_URL}/api/registrations/${registrationId}`,
      {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const res = (await response.json()) as { data: PutRegistrationResponse };
    return res.data;
  } catch (error) {
    console.error('Error posting registration:', error);
    return null;
  }
}

