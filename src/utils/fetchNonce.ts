async function fetchNonce() {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/auth/zupass/nonce`,
      {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    return data.nonce
  } catch (error) {
    console.error('Error fetching nonce:', error)
    throw error
  }
}

export default fetchNonce
