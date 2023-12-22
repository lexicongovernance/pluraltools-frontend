async function fetchOptions() {
  try {
    const response = await fetch('src/data/options.json', {
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
    console.log(
      '🚀 ~ file: fetchOptions.ts:19 ~ optionsWithHearts ~ optionsWithHearts:',
      optionsWithHearts
    );
    return optionsWithHearts;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default fetchOptions;
