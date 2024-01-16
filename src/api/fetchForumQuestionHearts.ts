async function fetchForumQuestionHearts(questionId: string): Promise<number | null> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/forum-questions/${questionId}/hearts`,
      {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const hearts = (await response.json()) as { data: number };
    return hearts.data;
  } catch (error) {
    console.error('Error fetching forum question statistics:', error);
    return null;
  }
}

export default fetchForumQuestionHearts;
