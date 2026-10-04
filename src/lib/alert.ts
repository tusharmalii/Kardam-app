/**
 * Trusted-contact alert module.
 * Frontend-only mock for now — no real SMS/WhatsApp/push is sent.
 * Kept modular so a real notification backend can be wired in later
 * by replacing the body of `sendTrustedContactAlert`.
 */
export interface AlertRecord {
  at: number;
  reason: 'safety_pin_used';
  status: 'queued_mock';
}

export function sendTrustedContactAlert(contactName: string | undefined): AlertRecord {
  const rec: AlertRecord = { at: Date.now(), reason: 'safety_pin_used', status: 'queued_mock' };
  try {
    const prev = JSON.parse(localStorage.getItem('kardam.alertLog') || '[]');
    prev.push({ ...rec, to: contactName ? 'trusted_contact' : 'unconfigured' });
    localStorage.setItem('kardam.alertLog', JSON.stringify(prev));
  } catch { /* storage unavailable — ignore */ }
  // NOTE: integration point for a real notification service.
  // The visible interface never shows whether or how this fired.
  return rec;
}
