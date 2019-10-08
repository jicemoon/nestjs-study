import { createHash } from 'crypto';

export function sha256(data) {
  return createHash('sha256')
    .update(data)
    .digest('hex');
}

export function getPersonalRoomID(from: string, to: string) {
  return [from, to].sort((a, b) => (a > b ? 1 : -1)).join('_');
}
