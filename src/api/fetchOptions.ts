async function fetchOptions() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const json = await response.json();
    const optionsWithHearts = json.map((post) => ({
      ...post,
      hearts: 0,
    }));
    return optionsWithHearts;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default fetchOptions;
