/**
 * True when a JWT's embedded sessionVersion no longer matches the DB (or the
 * user no longer exists) — meaning the token was issued before a password
 * reset/change and must be treated as logged out.
 */
export function isSessionVersionStale(dbSessionVersion: number | null | undefined, tokenSessionVersion: number): boolean {
  return dbSessionVersion === null || dbSessionVersion === undefined || dbSessionVersion !== tokenSessionVersion;
}
