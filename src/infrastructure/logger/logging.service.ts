import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggingService extends Logger {
  error(message: string, trace?: string, context?: string) {
    // Adicione aqui lógica adicional para logging de erros
    super.error(message, trace, context);
  }

  warn(message: string, context?: string) {
    // Adicione aqui lógica adicional para logging de avisos
    super.warn(message, context);
  }

  log(message: string, context?: string) {
    // Adicione aqui lógica adicional para logging de informações
    super.log(message, context);
  }

  debug(message: string, context?: string) {
    // Adicione aqui lógica adicional para logging de debug
    super.debug(message, context);
  }

  verbose(message: string, context?: string) {
    // Adicione aqui lógica adicional para logging detalhado
    super.verbose(message, context);
  }
}
