module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ ok: false });

  try {
    const url = process.env.GOOGLE_SCRIPT_URL;
    if (!url) return res.status(500).json({ ok: false, error: "Missing GOOGLE_SCRIPT_URL" });

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(req.body),
    });

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
};
