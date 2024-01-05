import { ResponseProposalType } from '../types/RegistrationType';

async function fetchRegistration(userId: string): Promise<ResponseProposalType | null> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/users/${userId}/registrations`,
      {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const registration = (await response.json()) as { data: ResponseProposalType };
    return registration.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default fetchRegistration;
