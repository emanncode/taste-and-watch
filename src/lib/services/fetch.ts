import { fetch as undiciFetch, Agent as UndiciAgent } from "undici";
import * as dns from "node:dns";

const ipv4Agent = new UndiciAgent({
  connect: {
    lookup: (hostname, options, callback) => {
      dns.lookup(hostname, { ...options, family: 4 }, callback);
    }
  }
});

/**
 * A custom fetch implementation that forces IPv4 DNS resolution.
 * This works around the ETIMEDOUT bug on environments where Node defaults to
 * IPv6 but the local network blackholes it.
 */
export const ipv4Fetch = (url: URL | RequestInfo | string, init?: RequestInit): Promise<Response> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return fetch(url, { ...init, dispatcher: ipv4Agent } as any);
};
