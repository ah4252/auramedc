import { sseClients } from "@/lib/sse-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const clientId = crypto.randomUUID();

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      sseClients.set(clientId, { id: clientId, controller });
      // إرسال ping للتأكد من أن الاتصال يعمل
      controller.enqueue(new TextEncoder().encode("event: ping\ndata: {}\n\n"));
    },
    cancel() {
      sseClients.delete(clientId);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
