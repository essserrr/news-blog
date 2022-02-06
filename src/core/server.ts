import { RequestHandler } from 'express';
import { App } from 'src/core/app';

type Handler = (app: App) => RequestHandler;

interface MessageResponse {
  message: string;
}

export type { Handler, MessageResponse };
