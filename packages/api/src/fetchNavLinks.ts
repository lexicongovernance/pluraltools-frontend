import { ApiRequest, GetNavLinksResponse } from './types';

export async function fetchNavLinks({
  serverUrl,
}: ApiRequest<unknown>): Promise<GetNavLinksResponse | null> {
  try {
    const response = await fetch(`${serverUrl}/api/nav-links`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const navLinks = (await response.json()) as { data: GetNavLinksResponse };
    return navLinks.data;
  } catch (error) {
    console.error('Error fetching nav links:', error);
    return null;
  }
}
