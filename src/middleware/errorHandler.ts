export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export const errorHandler = (
  handler: (req: Request, ...args: unknown[]) => Promise<Response>,
) => {
  return async (req: Request, ...args: unknown[]) => {
    try {
      return await handler(req, ...args);
    } catch (error: unknown) {
      console.error("[API Error]", error);

      const message =
        error instanceof Error ? error.message : "Internal Server Error";
      const status = error instanceof ApiError ? error.statusCode : 500;

      return Response.json(
        {
          success: false,
          error: message,
        },
        { status },
      );
    }
  };
};
