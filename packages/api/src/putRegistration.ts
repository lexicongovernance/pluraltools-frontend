import { ApiRequest, PutRegistrationRequest, PutRegistrationResponse } from './types';

export async function putRegistration({
  registrationId,
  body,
  serverUrl,
}: ApiRequest<{
  registrationId: string;
  body: PutRegistrationRequest;
}>): Promise<PutRegistrationResponse | { errors: string[] } | null> {
  try {
    const response = await fetch(`${serverUrl}/api/registrations/${registrationId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status < 500) {
        const errors = (await response.json()) as { errors: string[] };
        return errors;
      }
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const res = (await response.json()) as { data: PutRegistrationResponse };
    return res.data;
  } catch (error) {
    console.error('Error posting registration:', error);
    return null;
  }
}
