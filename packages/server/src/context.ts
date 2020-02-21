import {Span, SpanOptions} from 'opentracing';
import {Transaction} from 'objection';
import {Request} from 'express';

export interface BaseContext {
  span: Span;
  req?: Request;

  // TODO anonymous user?
  user?: {id: number; username: string};
  startSpan(name: string, options?: SpanOptions): Span;
}

export type SqlContext = BaseContext & {
  trx?: Transaction;
};

type Context = BaseContext;

export default Context;
