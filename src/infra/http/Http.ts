export type Request = {
  url: string;
  file?: {
    [key: string]: any;
  };
  body: {
    [key: string]: any;
  };
  query: {
    [key: string]: any;
  };
  params: {
    [key: string]: any;
  };
  headers: any;
};

export type Response = {
  status(status: number): Response;
  json(body: any): Response;
  send(body: any): Response;
  end(): void;
  statusCode?: number;
  setHeader(key: string, value: string): any;
};

export type NextFunction = () => void;

export type Method = "get" | "post" | "put" | "delete";

export type Handler = (
  request: Request,
  response: Response,
  next: NextFunction
) => Promise<void> | void;

export interface HttpServer<T = any> {
  getApp(): T;
  listen(port: number, callback: () => void): void;
  registerMiddleware(handler: Handler): void;
  static(path: string): void;
  on(
    method: Method,
    route: string,
    handler: Handler,
    ...middleware: Handler[]
  ): void;
}
