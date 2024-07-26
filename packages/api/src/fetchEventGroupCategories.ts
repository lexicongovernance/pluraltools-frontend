import { GetGroupCategoriesResponse } from './types';

export async function fetchEventGroupCategories(
  eventId: string,
): Promise<GetGroupCategoriesResponse | null> {
  try {
    const response = await fetch(
      `${process.env.VITE_SERVER_URL}/api/events/${eventId}/group-categories`,
      {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const groupCategories = (await response.json()) as { data: GetGroupCategoriesResponse };
    return groupCategories.data;
  } catch (error) {
    console.error('Error fetching cycles:', error);
    return null;
  }
}
