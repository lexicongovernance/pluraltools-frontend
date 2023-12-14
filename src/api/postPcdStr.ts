const postPcdStr = async (pcdStr: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/auth/zupass/verify`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pcd: JSON.parse(pcdStr).pcd }),
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    console.log('POST successful. Response:')
  } catch (error) {
    console.error('Error during POST request:', error)
    return null
  }
}

export default postPcdStr
