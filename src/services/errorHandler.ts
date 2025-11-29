// src/services/errorHandler.ts

export enum ErrorCodes {
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTH_ERROR = 'AUTH_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface AppError {
  message: string;
  code: ErrorCodes;
  details?: any;
}

class ErrorHandler {
  public handleError(error: any, context: string): AppError {
    const appError: AppError = {
      message: 'An unknown error occurred',
      code: ErrorCodes.UNKNOWN_ERROR,
    };

    if (error.code === 'ECONNABORTED' || error.message.includes('Network')) {
      appError.message = 'Network request failed';
      appError.code = ErrorCodes.NETWORK_ERROR;
    } else if (error.response) {
      appError.message = error.response.data?.message || 'An error occurred';
      if (error.response.status === 401) {
        appError.code = ErrorCodes.AUTH_ERROR;
      }
    } else if (error.message) {
      appError.message = error.message;
    }

    console.error(`[${context}] Error:`, appError.message, {
      code: appError.code,
      details: error,
    });

    return appError;
  }
}

export const errorHandler = new ErrorHandler();
