async function logout() {
  try {
    const response = await fetch(`${process.env.VITE_SERVER_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error('Error during logout:', error);
    throw new Error('Logout failed');
  }
}

export default logout;
