import { z } from 'zod';

export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number = 500, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      throw new ApiError(response.statusText, response.status);
    }
    throw new ApiError(
      errorData.message || 'An error occurred',
      response.status,
      errorData
    );
  }
  
  return response.json();
}

export function createApiHandler<Input, Output>(
  schema: z.ZodType<Input>,
  handler: (input: Input) => Promise<Output>
) {
  return async (input: unknown): Promise<Output> => {
    try {
      const validatedInput = schema.parse(input);
      return await handler(validatedInput);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ApiError('Validation error', 400, {
          errors: error.errors,
        });
      }
      throw error;
    }
  };
}

export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T) => {
    try {
      return await fn(...args);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error('Unexpected error:', error);
      throw new ApiError(
        'An unexpected error occurred',
        500,
        process.env.NODE_ENV === 'development' ? error : undefined
      );
    }
  };
}
