
export const toStorable = function(e: Error): AppErrorStorable {
  const type = (e instanceof AppError) ? e.type : null;
  return {
    message: e.message,
    name: e.name,
    stack: e.stack,
    type: type,  
  }
};

export type AppErrorType = 'NoSpotifyAccess' | null;
export interface AppErrorStorable {
  message: string;
  stack: string | undefined;
  name: string;
  type: AppErrorType;
}

export class AppError extends  Error {
  private _type: AppErrorType = null;

  constructor(message: string, type?: AppErrorType) {
    super(message);
    if (type) {
      this._type = type;
    }
  }

  get type(): AppErrorType {
    return this._type;
  }

  set type(type: AppErrorType) {
    this._type = type;
  }

  toJSON() {
    return toStorable(this);
  }
}
