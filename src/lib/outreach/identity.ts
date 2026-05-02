/**
 * Sender identity for admin-initiated vendor outreach.
 *
 * All inquiries are sent from the dedicated procurement mailbox, NOT a
 * personal address — this protects the operator's identity and keeps every
 * thread routable to the shared sourcing@ inbox.
 *
 * Replies land back at the same mailbox (replyTo === from).
 */

export const SOURCING_FROM = 'Deeptech Sourcing <sourcing@deeptechnologies.dev>';
export const SOURCING_REPLY_TO = 'sourcing@deeptechnologies.dev';

/** Plain-text closing block appended to every outbound email. */
export const SOURCING_SIGNATURE_TEXT = `

—
Deeptech Sourcing & Solutions
Procurement on behalf of qualified end-buyers
sourcing@deeptechnologies.dev  ·  https://deeptechnologies.dev
`;

/** HTML closing block appended to every outbound email. */
export const SOURCING_SIGNATURE_HTML = `
<hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0 16px;" />
<p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;color:#666;line-height:1.6;margin:0;">
  <strong style="color:#111;letter-spacing:0.05em;">Deeptech Sourcing &amp; Solutions</strong><br />
  Procurement on behalf of qualified end-buyers<br />
  <a href="mailto:sourcing@deeptechnologies.dev" style="color:#666;text-decoration:underline;">sourcing@deeptechnologies.dev</a>
  &nbsp;·&nbsp;
  <a href="https://deeptechnologies.dev" style="color:#666;text-decoration:underline;">deeptechnologies.dev</a>
</p>
`;
