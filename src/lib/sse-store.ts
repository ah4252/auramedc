// مخزن اتصالات SSE — يحتفظ بقائمة المستخدمين المتصلين حالياً
// يعمل كمتغير عالمي واحد في عملية Node.js

type SSEClient = {
  id: string;
  controller: ReadableStreamDefaultController<Uint8Array>;
};

declare global {
  var __sseClients: Map<string, SSEClient> | undefined;
}

if (!global.__sseClients) {
  global.__sseClients = new Map();
}

export const sseClients: Map<string, SSEClient> = global.__sseClients;

/**
 * يرسل حدثاً لجميع المستخدمين المتصلين حالياً
 */
export function broadcast(event: string, data: Record<string, unknown>) {
  const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  const encoded = new TextEncoder().encode(message);
  const toDelete: string[] = [];

  for (const client of Array.from(sseClients.values())) {
    try {
      client.controller.enqueue(encoded);
    } catch {
      toDelete.push(client.id);
    }
  }

  for (const id of toDelete) {
    sseClients.delete(id);
  }
}
