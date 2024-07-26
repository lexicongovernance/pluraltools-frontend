import { GetOptionUsersResponse } from './types';

export async function fetchOptionUsers(optionId: string): Promise<GetOptionUsersResponse | null> {
  try {
    const response = await fetch(`${process.env.VITE_SERVER_URL}/api/options/${optionId}/users`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const alerts = (await response.json()) as { data: GetOptionUsersResponse };
    return alerts.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    return null;
  }
}
