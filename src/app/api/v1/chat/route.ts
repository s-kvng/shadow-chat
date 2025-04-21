import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});

/**
 * @param {Request} req
 * @returns {Promise<Response>}
 * @description This function handles the POST request to the /api/v1/chat endpoint.
 * It takes a JSON object with a prompt, sends it to the OpenAI API, and returns the response as a stream.
 */
export async function POST(req: Request) {
    const { prompt: input } = await req.json();

    const result = await client.chat.completions.create({
        model: "llama3-8b-8192",
        messages: [
            { role: "user", content: input }
        ],
        stream: true
    });

    const stream = new ReadableStream({
        async start(controller) {
            for await (const chunk of result) {
                const content = chunk.choices[0]?.delta?.content || "";
                controller.enqueue(new TextEncoder().encode(content));
            }
            controller.close();
        }
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
        },
    });
}