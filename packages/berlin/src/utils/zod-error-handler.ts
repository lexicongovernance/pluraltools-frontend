import { z } from 'zod';

export function returnZodError(validationFn: () => string): string | undefined {
  try {
    validationFn();
  } catch (error) {
    // check if zod error
    if (error instanceof z.ZodError) {
      return error.errors[0].message;
    }
  }
}
