import pino from 'pino';
import pinoHttp from 'pino-http';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',

  base: { service_name: process.env.PDF_SERVICE_NAME || 'pdf-service' },

  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },

  timestamp: pino.stdTimeFunctions.isoTimeNano,
});

export const loggerMiddleware = pinoHttp({
  logger: logger,

  customAttributeKeys: {
    req: 'request',
    res: 'response',
  },

  serializers: {
    req(req) {
      req.path = req.url;
      delete req.url;
      delete req.id;
      delete req.headers.title;

      return req;
    },
  },

  customProps: function (req, res) {
    return {
      trace_id: req.headers.traceparent?.split('-')[1],
    };
  },
});
