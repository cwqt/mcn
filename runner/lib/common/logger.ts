const winston = require('winston');
import config from '../config';

export const logger = winston.createLogger({
  level: 'silly',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

logger.stream = {
    write: function(message:any, encoding:any){
        logger.http(message ?? "");
    }
};

if (config.DEVELOPMENT) {
    logger.add(new winston.transports.Console({
        format:
            winston.format.combine(winston.format.colorize(),
            winston.format.printf((info:any) => `[${info.level}]: ${info.message.trim()}`))
    }));
}

class Logger {
  debug = (message:string) => this.log(message, 'debug')
  info = (message:string) => this.log(message, 'info')
  error = (message:string) => this.log(message, 'error')
  agenda = (message:string) => this.log(message, 'agenda')

  log = (message:string, level:string) => {
    message = message ?? "";
    switch(level) {
      case 'info':
        logger.info(message);
        break;
      case 'debug':
        logger.debug(message)
        break;
      case 'error':
        logger.error(message);
        break;
      case 'agenda':
        console.log(`[\x1b[35magenda\x1b[0m]: ${message}`);
        break;
    }
  }
}

export const log = new Logger();
