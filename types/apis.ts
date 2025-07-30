/**
 * Api 호출 시 발생하는 에러를 나타내는 클래스입니다.
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
