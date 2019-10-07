import { createHash } from 'crypto';

export function sha256(data) {
  return createHash('sha256')
    .update(data)
    .digest('hex');
}
