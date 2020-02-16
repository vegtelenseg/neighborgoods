import {Span} from 'opentracing';

export default interface Context {
  span: Span;
}
