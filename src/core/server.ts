import { RequestHandler } from 'express';
import { App } from 'src/core/app';

export type Handler = (app: App) => RequestHandler;
