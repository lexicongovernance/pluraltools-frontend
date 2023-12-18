import { ProposalType } from '../types/ProposalType';

async function postRegistration({
  userId,
  email,
  username,
  id,
  proposalTitle,
  proposalAbstract,
  status,
  groupIds,
}: ProposalType) {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/registrations`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        email,
        username,
        id,
        proposalTitle,
        proposalAbstract,
        status,
        groupIds,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const post = await response.json();
    console.log('🚀 ~ file: postRegistration.ts:37 ~ post:', post);
    return post.data;
  } catch (error) {
    console.error('Error during POST request:', error);
    return null;
  }
}

export default postRegistration;
