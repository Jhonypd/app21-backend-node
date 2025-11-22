import { Request } from "express";

/**
 * Normaliza IPs locais para um formato consistente
 */
function normalizeLocalIp(ip: string): string {
  // IPs IPv6 localhost
  if (ip === "::1" || ip === "::ffff:127.0.0.1") {
    return "127.0.0.1";
  }

  // Remove prefixo IPv6-mapped IPv4
  if (ip.startsWith("::ffff:")) {
    return ip.substring(7);
  }

  return ip;
}

/**
 * Extrai o IP real do cliente da requisição
 * Considera proxies e load balancers através dos headers X-Forwarded-For e X-Real-IP
 */
export function getClientIp(req: Request): string {
  // Tenta obter o IP dos headers comuns de proxy
  const xForwardedFor = req.headers["x-forwarded-for"];
  const xRealIp = req.headers["x-real-ip"];

  let ip: string;

  // X-Forwarded-For pode conter múltiplos IPs separados por vírgula
  // O primeiro é o IP do cliente original
  if (xForwardedFor) {
    const ips = Array.isArray(xForwardedFor) ? xForwardedFor[0] : xForwardedFor;
    ip = ips.split(",")[0].trim();
  }
  // X-Real-IP é usado por alguns proxies (como Nginx)
  else if (xRealIp) {
    ip = Array.isArray(xRealIp) ? xRealIp[0] : xRealIp;
  }
  // Fallback para o IP direto da conexão
  else {
    ip = req.ip || req.socket.remoteAddress || "unknown";
  }

  return normalizeLocalIp(ip);
}

/**
 * Extrai o User-Agent da requisição
 */
export function getClientUserAgent(req: Request): string {
  return req.get("User-Agent") || "unknown";
}

/**
 * Extrai informações do cliente (IP e User-Agent)
 */
export function getClientInfo(req: Request) {
  return {
    ip: getClientIp(req),
    userAgent: getClientUserAgent(req),
  };
}
