export interface FieldErrors {
  [field: string]: string;
}

export interface MappedError {
  fieldErrors: FieldErrors;
  generalError: string | null;
}

interface BackendFieldError {
  field: string;
  message: string;
}

interface BackendErrorResponse {
  errors?: BackendFieldError[];
  message?: string;
}

export function mapBackendErrors(error: unknown): MappedError {
  const result: MappedError = {
    fieldErrors: {},
    generalError: null,
  };

  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as { response?: unknown }).response === 'object'
  ) {
    const response = (error as { response: { data?: BackendErrorResponse } }).response;
    const data = response.data;

    if (data?.errors && Array.isArray(data.errors)) {
      data.errors.forEach(({ field, message }) => {
        result.fieldErrors[field] = message;
      });
    } else if (data?.message) {
      result.generalError = data.message;
    } else {
      result.generalError = 'Something went wrong. Please try again.';
    }
  } else {
    result.generalError = 'Network error. Please check your connection.';
  }

  return result;
}
