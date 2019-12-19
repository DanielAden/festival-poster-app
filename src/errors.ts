

type GlobalErrorType = 'AuthExpiredError';
abstract class GlobalError extends Error {
  public abstract get type(): GlobalErrorType; 
}

export class AuthExpiredError extends GlobalError {
  get type() {
    return 'AuthExpiredError' as 'AuthExpiredError';
  }
}