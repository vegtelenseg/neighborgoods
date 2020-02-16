// @ts-ignore
import {initTracer} from 'jaeger-client';
import {Tracer} from 'opentracing';

import config from './config';

const jaegerConfig = config.get('jaeger');

const tracerConfig = {
  serviceName: 'paperless',
  disable: !jaegerConfig.enabled,
  // Jaeger is only used in dev so enable const sampler
  sampler: {
    type: 'const',
    param: 1,
  },
  reporter:
    config.get('env') !== 'production'
      ? {
          // Use http locally due to udp issues
          collectorEndpoint: `http://${
            jaegerConfig.agentHost
          }:14268/api/traces`,
        }
      : {
          agentHost: jaegerConfig.agentHost,
        },
};

const options = {
  tags: {
    // TODO: pull version from package.json
    // 'my-awesome-service.version': '1.1.2',
  },
  // metrics: metrics,
  logger: {
    info(msg: string) {
      // tslint:disable-next-line no-console
      console.log(msg);
    },
    error(msg: string) {
      // tslint:disable-next-line no-console
      console.error(msg);
    },
  },
};

const tracer: Tracer = initTracer(tracerConfig, options);

export default tracer;
