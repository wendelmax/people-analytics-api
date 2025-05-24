import { Code } from '../code/Code';

export class Exception extends Error {
  public readonly code: Code;
  public readonly message: string;

  private constructor(code: Code, message: string) {
    super(message);
    this.code = code;
    this.message = message;
  }

  public static new({ code, message }: { code: Code; message?: string }): Exception {
    return new Exception(code, message || code.message);
  }
}
