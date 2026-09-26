import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";

export async function getAIModel() {
  const geminiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.AI_PROVIDER_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const nvidiaKey = process.env.NVIDIA_API_KEY;

  if (!geminiKey && !groqKey && !nvidiaKey) {
    throw new Error("No AI Provider API key configured. Set GROQ_API_KEY, NVIDIA_API_KEY, or GOOGLE_GENERATIVE_AI_API_KEY.");
  }

  // WORKAROUND: Force IPv4 for the AI SDK to bypass the local IPv6 ETIMEDOUT bug
  const { fetch: undiciFetch, Agent: UndiciAgent } = await import("undici");
  const dns = await import("node:dns");
  
  const ipv4Agent = new UndiciAgent({
    connect: {
      lookup: (hostname, options, callback) => {
        dns.lookup(hostname, { ...options, family: 4 }, callback);
      }
    }
  });

  const customFetch = (url: URL | RequestInfo, init?: RequestInit) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return undiciFetch(url as any, { ...init, dispatcher: ipv4Agent } as any) as unknown as Promise<Response>;
  };

  // Dynamically select the provider based on available keys
  if (groqKey) {
    const groq = createOpenAI({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: groqKey,
      fetch: customFetch
    });
    return groq("openai/gpt-oss-120b");
  } else if (nvidiaKey) {
    const nvidia = createOpenAI({
      baseURL: "https://integrate.api.nvidia.com/v1",
      apiKey: nvidiaKey,
      fetch: customFetch
    });
    return nvidia("meta/llama-3.1-70b-instruct");
  } else {
    const google = createGoogleGenerativeAI({ 
      apiKey: geminiKey,
      fetch: customFetch
    });
    return google("gemini-3.8-flash");
  }
}
