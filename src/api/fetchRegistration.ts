import { ResponseProposalType } from '../types/ProposalType';

async function fetchRegistration(userId: string): Promise<ResponseProposalType | null> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/users/${userId}/registration`,
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
    console.error('Error fetching registration:', error);
    return null;
  }
}

export default fetchRegistration;
