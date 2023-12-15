async function fetchGroups() {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/grups`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching groups:', error);
    return null;
  }
}

export default fetchGroups;
