type PostPcdStrProps = {
  pcdStr: string
}

const postPcdStr = async ({ pcdStr }: PostPcdStrProps) => {
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

    const responseData = await response.json()
    console.log('POST successful. Response:', responseData)
    return responseData
  } catch (error) {
    console.error('Error during POST request:', error)
    throw error
  }
}

export default postPcdStr
