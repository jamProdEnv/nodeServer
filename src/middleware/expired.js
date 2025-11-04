export const expired = new Set();

export function CheckExpired(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (token && expired.has(token)) {
    return res.statsu(400).json({ error: "Token Revoked." });
  }
  next();
}
