export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const {
    first_name, last_name, email, profile_url,
    role, location, why, consent
  } = req.body || {};

  if (!first_name || !last_name || !email || !role || !why)
    return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });

  if (consent !== 'true')
    return res.status(400).json({ success: false, message: 'Consent is required.' });

  const roleLabels = {
    offshore_engineering: 'Offshore / Marine Engineering',
    maritime_law: 'Maritime / International Law',
    project_finance: 'Infrastructure / Project Finance',
    government_relations: 'Government Relations / Energy Policy',
    ai_compute: 'AI / Data Center Infrastructure',
    aquafarming: 'Aquafarming / Marine Biology',
    operations: 'Offshore Operations / Crew',
    founder_generalist: 'Founder / Operator',
    investor: 'Investor / Capital Allocator',
    other: 'Other'
  };

  const ref = 'FX-' + Math.random().toString(16).slice(2, 9).toUpperCase();

  const msg =
    `🌊 <b>FathomX — New Application</b>\n` +
    `👤 ${first_name} ${last_name}\n` +
    `📧 ${email}\n` +
    (profile_url ? `🔗 ${profile_url}\n` : '') +
    `🎯 Role: ${roleLabels[role] || role}\n` +
    (location ? `📍 ${location}\n` : '') +
    `💬 <i>${why}</i>\n` +
    `🔑 Ref: <code>${ref}</code>`;

  try {
    await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: msg,
          parse_mode: 'HTML'
        })
      }
    );
  } catch (e) {
    console.error('Telegram notify failed:', e);
  }

  res.json({
    success: true,
    referenceId: ref,
    message: `Thank you, ${first_name}. We'll be in touch.`
  });
}
