async function fetchCycles() {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/cycles`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const x = await response.json();
    return x.data;
  } catch (error) {
    console.error('Error fetching cycles:', error);
    return null;
  }
}

export default fetchCycles;
