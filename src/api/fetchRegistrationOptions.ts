import { ResponseRegistrationOptionsType } from '../types/RegistrationOption';

async function fetchRegistrationOptions(): Promise<ResponseRegistrationOptionsType | null> {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/registration-options`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const options = (await response.json()) as { data: ResponseRegistrationOptionsType };
    return options.data;
  } catch (error) {
    console.error('Error fetching nonce:', error);
    return null;
  }
}

export default fetchRegistrationOptions;
