import { txlineClient } from "@/lib/txline/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const [status, matches] = await Promise.all([txlineClient.getStatus(), txlineClient.getMatches()]);
      const primaryMatch = matches[0];
      const payload = {
        status,
        matches,
        odds: primaryMatch ? await txlineClient.getOddsForMatch(primaryMatch.id) : [],
        events: primaryMatch ? await txlineClient.getEventsForMatch(primaryMatch.id) : []
      };

      controller.enqueue(encoder.encode(`event: snapshot\ndata: ${JSON.stringify(payload)}\n\n`));
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Content-Type": "text/event-stream"
    }
  });
}
