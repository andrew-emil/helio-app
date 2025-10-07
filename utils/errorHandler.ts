import { ERROR_MESSAGES, SUCCESS_MESSAGES } from './errorMessages';

export class AppError extends Error {
  public readonly code: string;
  public readonly originalError?: Error;

  constructor(message: string, code: string, originalError?: Error) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.originalError = originalError;
  }
}

export const createErrorHandler = () => {
  const handleError = (error: unknown, context: string): AppError => {
    console.error(`Error in ${context}:`, error);

    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      // Handle specific Firebase errors
      if (error.message.includes('auth/requires-recent-login')) {
        return new AppError(
          ERROR_MESSAGES.AUTH.REQUIRES_RECENT_LOGIN,
          'AUTH_REQUIRES_RECENT_LOGIN',
          error
        );
      }

      if (error.message.includes('permission')) {
        return new AppError(
          ERROR_MESSAGES.IMAGE.PERMISSION_DENIED,
          'IMAGE_PERMISSION_DENIED',
          error
        );
      }

      if (error.message.includes('network') || error.message.includes('fetch')) {
        return new AppError(
          ERROR_MESSAGES.GENERAL.NETWORK_ERROR,
          'NETWORK_ERROR',
          error
        );
      }

      return new AppError(
        error.message || ERROR_MESSAGES.GENERAL.UNKNOWN_ERROR,
        'UNKNOWN_ERROR',
        error
      );
    }

    return new AppError(
      ERROR_MESSAGES.GENERAL.UNKNOWN_ERROR,
      'UNKNOWN_ERROR'
    );
  };

  const handleSuccess = (message: string) => {
    console.log('Success:', message);
  };

  return {
    handleError,
    handleSuccess,
  };
};

export const errorHandler = createErrorHandler();
