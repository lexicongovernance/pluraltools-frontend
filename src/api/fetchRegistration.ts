import { ProposalType } from '../types/ProposalType';

async function fetchRegistration(userId: string): Promise<ProposalType | null> {
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

    const data = (await response.json()) as ProposalType;
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default fetchRegistration;
