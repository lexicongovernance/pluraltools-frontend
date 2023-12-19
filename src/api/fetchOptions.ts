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

    const options = await response.json();
    return options;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default fetchOptions;
