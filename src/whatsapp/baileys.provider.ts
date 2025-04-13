import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  WASocket,
} from '@whiskeysockets/baileys';

import * as fs from 'fs';
import * as path from 'path';
import type { Boom } from '@hapi/boom';

// Armazena sessões por companyId
const sessions: Record<string, WASocket> = {};

// Conecta ao WhatsApp com persistência por empresa
export async function connectToWhatsApp(
  companyId: string,
  onMessage: (msg: { jid: string; message: string; fromMe: boolean }) => void,
): Promise<WASocket> {
  const sessionsRoot = path.join(__dirname, '..', '..', 'sessions');
  const authFolder = path.join(sessionsRoot, companyId);

  // Cria pastas se necessário
  if (!fs.existsSync(sessionsRoot)) fs.mkdirSync(sessionsRoot);
  fs.mkdirSync(authFolder, { recursive: true });

  const { state, saveCreds } = await useMultiFileAuthState(authFolder);

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  sessions[companyId] = sock;

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const remoteJid = msg.key.remoteJid ?? '';

    const content =
      msg.message.conversation || msg.message?.extendedTextMessage?.text || '';

    if (content.trim().length === 0) return;

    await onMessage({
      jid: remoteJid,
      message: content,
      fromMe: !!msg.key.fromMe,
    });
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'close') {
      const shouldReconnect =
        (lastDisconnect?.error as Boom)?.output?.statusCode !==
        DisconnectReason.loggedOut;

      if (shouldReconnect) {
        console.log(`[${companyId}] Reconnecting...`);
        connectToWhatsApp(companyId, onMessage);
      } else {
        console.log(`[${companyId}] Session logged out`);
        delete sessions[companyId];
      }
    } else if (connection === 'open') {
      console.log(`[${companyId}] WhatsApp connected ✅`);
    }
  });

  return sock;
}

// Retorna a sessão ativa
export function getSession(companyId: string): WASocket | null {
  return sessions[companyId] || null;
}

// Remove a sessão (logout manual)
export function removeSession(companyId: string) {
  const session = sessions[companyId];
  if (session) {
    session.logout();
    delete sessions[companyId];
  }
}
