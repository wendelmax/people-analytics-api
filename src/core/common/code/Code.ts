export class Code {
  public static readonly ACCESS_DENIED_ERROR = new Code('ACCESS_DENIED_ERROR', 'Access denied');
  public static readonly UNAUTHORIZED_ERROR = new Code('UNAUTHORIZED_ERROR', 'Unauthorized');

  private constructor(
    public readonly code: string,
    public readonly message: string,
  ) {}
}
