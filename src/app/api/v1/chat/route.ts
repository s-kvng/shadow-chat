import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

/**
 * @param {Request} req
 * @returns {Promise<Response>}
 * @description This function handles the POST request to the /api/v1/chat endpoint.
 * It takes a JSON object with a prompt, sends it to the OpenAI API, and returns the response.
 */
export async function POST(req: Request){
    const { prompt: input } = await req.json()

    const result = await client.chat.completions.create({
        model: "deepseek-r1-distill-llama-70b",
        messages: [
            { role: "user", content: input }
          ],
    })
// console.log("result -> ",result)
// console.log("result.output_text -> ",result.choices[0].message)
const rawResponse=result.choices[0].message.content
 // Clean each line of the raw response
 const formatted = rawResponse
 .split('\n')
 .map(line =>
   line
     .replace(/^['"`]\s*\+?\s*/, '')  // Remove leading quote and optional `+`
     .replace(/['"`]\s*$/, '')       // Remove trailing quote
 )
 .join('\n');

 console.log("formatted -> ",formatted)

// Split the cleaned response into thinking and final answer
const [thinking, finalResponse] = formatted.split('</think>\n');

// Return both parts in a structured format
return Response.json({
 thinking: thinking?.trim(),
 response: finalResponse?.trim(),
});
}