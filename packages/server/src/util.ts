import {Request} from 'express';
import {SpanOptions} from 'opentracing';
import Context from './context';
import tracer from './tracer';

export const startSpan = (name: string, options?: SpanOptions) =>
  tracer.startSpan(name, options);

export function createContext(req: Request): Context {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let span = (req as any).span;

  if (span == null) {
    span = tracer.startSpan('UNKNOWN');
  }

  return {
    span,
    // eslint-disable-next-line
    // @ts-ignore
    user: req.user,
    req,
    startSpan,
  };
}
