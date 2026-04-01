import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_SCAMLIKELY_API_KEY);

export async function POST(request: Request) {
  // CORS preflight is handled by Next.js middleware; add headers to response
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const body = await request.json();
    const { email } = body as { email: string };

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: 'A valid email address is required.' },
        { status: 400, headers: corsHeaders }
      );
    }

    const timestamp = new Date().toLocaleString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
    });

    const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pilot Request — Scam Likely</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e8e8e8;">

          <!-- Header -->
          <tr>
            <td style="background:#000000;padding:32px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#666666;font-weight:500;">Scam Likely</p>
                    <h1 style="margin:8px 0 0;font-size:22px;font-weight:600;color:#ffffff;letter-spacing:-0.02em;">New Pilot Request</h1>
                  </td>
                  <td align="right" valign="middle">
                    <div style="width:36px;height:36px;border:2px solid #ffffff;display:inline-block;text-align:center;line-height:36px;">
                      <span style="color:#ffffff;font-size:14px;font-weight:bold;">●</span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Requester Email -->
          <tr>
            <td style="padding:36px 40px 0;">
              <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#999999;font-weight:500;">Requester Email</p>
              <a href="mailto:${email}" style="margin:0;font-size:17px;color:#111111;font-weight:600;text-decoration:underline;">${email}</a>
            </td>
          </tr>

          <!-- Request Type -->
          <tr>
            <td style="padding:28px 40px 0;">
              <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#999999;font-weight:500;">Request Type</p>
              <p style="margin:0;font-size:15px;color:#111111;font-weight:600;">90-Day Free Pilot</p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:28px 40px 0;">
              <hr style="border:none;border-top:1px solid #eeeeee;margin:0;" />
            </td>
          </tr>

          <!-- Details -->
          <tr>
            <td style="padding:28px 40px 0;">
              <p style="margin:0 0 12px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#999999;font-weight:500;">Next Steps</p>
              <p style="margin:0;font-size:15px;color:#333333;line-height:1.7;">A community bank or credit union representative has requested a free pilot of Scam Likely. Reply to schedule a brief onboarding call and share sandbox access.</p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:36px 40px;">
              <a href="mailto:${email}?subject=Scam Likely — Your Pilot Request"
                style="display:inline-block;background:#000000;color:#ffffff;font-size:13px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;text-decoration:none;padding:14px 28px;">
                Reply to Requester
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9f9f9;border-top:1px solid #eeeeee;padding:24px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:11px;color:#aaaaaa;line-height:1.6;">
                      Received via <strong style="color:#888888;">Scam Likely Landing Page</strong><br />
                      ${timestamp}
                    </p>
                  </td>
                  <td align="right">
                    <p style="margin:0;font-size:11px;color:#cccccc;letter-spacing:0.15em;text-transform:uppercase;">Scam Likely</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const { error } = await resend.emails.send({
      from: 'Scam Likely <onboarding@resend.dev>',
      to: '1deeptechnology@gmail.com',
      replyTo: email,
      subject: `[Pilot Request] ${email}`,
      text: `New pilot request from: ${email}\n\nRequest: 90-day free pilot\n\n---\nReceived ${timestamp}`,
      html: htmlTemplate,
    });

    if (error) {
      console.error('[pilot-request] Resend error:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to send — please try again later.' },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Pilot request received!' },
      { headers: corsHeaders }
    );
  } catch (err) {
    console.error('[pilot-request] Unexpected error:', err);
    return NextResponse.json(
      { success: false, message: 'Something went wrong.' },
      { status: 500, headers: corsHeaders }
    );
  }
}

/** Handle CORS preflight */
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

