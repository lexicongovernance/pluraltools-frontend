import { GetRegistrationDataResponse } from './types';

export async function fetchRegistrationData(
  registrationId: string,
): Promise<GetRegistrationDataResponse | null> {
  try {
    const response = await fetch(
      `${process.env.VITE_SERVER_URL}/api/registrations/${registrationId}/registration-data`,
      {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const res = (await response.json()) as { data: GetRegistrationDataResponse };
    return res.data;
  } catch (error) {
    console.error('Error fetching registration data:', error);
    return null;
  }
}
