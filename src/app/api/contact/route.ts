import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { forwardToNimbus } from '@/lib/nimbus';

const resend = new Resend(process.env.RESEND_API_KEY);

/** Intake fields sent from the conditional form sections */
interface IntakeFields {
  environmentType?: string;
  systemCategory?: string;
  payloadDescription?: string;
  terrainSurface?: string;
  deploymentScale?: string;
  integrationNeeds?: string[];
  projectType?: string;
  techStack?: string;
  contentType?: string;
  deliverables?: string;
  styleReferences?: string;
  budgetRange?: string;
  timeline?: string;
}

/** Build a human-readable summary of intake fields for the email */
function formatIntakeSummary(inquiry: string, intake: IntakeFields): string {
  const lines: string[] = [];
  const add = (label: string, val: string | string[] | undefined) => {
    if (!val || (Array.isArray(val) && val.length === 0)) return;
    lines.push(`${label}: ${Array.isArray(val) ? val.join(', ') : val}`);
  };

  if (inquiry === 'Autonomous solutions') {
    add('Environment', intake.environmentType);
    add('System Category', intake.systemCategory);
    add('Payload', intake.payloadDescription);
    add('Terrain', intake.terrainSurface);
    add('Scale', intake.deploymentScale);
    add('Integrations', intake.integrationNeeds);
  } else if (inquiry === 'Software solutions') {
    add('Project Type', intake.projectType);
    add('Tech Stack', intake.techStack);
  } else if (inquiry === 'Media solutions') {
    add('Content Type', intake.contentType);
    add('Deliverables', intake.deliverables);
    add('Style References', intake.styleReferences);
  }
  add('Budget', intake.budgetRange);
  add('Timeline', intake.timeline);

  return lines.length > 0 ? lines.join('\n') : '';
}

/** Build HTML rows for intake fields */
function formatIntakeHtml(inquiry: string, intake: IntakeFields): string {
  const rows: string[] = [];
  const add = (label: string, val: string | string[] | undefined) => {
    if (!val || (Array.isArray(val) && val.length === 0)) return;
    const display = Array.isArray(val) ? val.join(', ') : val;
    rows.push(`
      <tr>
        <td style="padding:6px 0;vertical-align:top;">
          <p style="margin:0;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#999999;font-weight:500;">${label}</p>
        </td>
        <td style="padding:6px 0 6px 16px;vertical-align:top;">
          <p style="margin:0;font-size:14px;color:#111111;font-weight:500;">${display}</p>
        </td>
      </tr>`);
  };

  if (inquiry === 'Autonomous solutions') {
    add('Environment', intake.environmentType);
    add('System Category', intake.systemCategory);
    add('Payload', intake.payloadDescription);
    add('Terrain', intake.terrainSurface);
    add('Scale', intake.deploymentScale);
    add('Integrations', intake.integrationNeeds);
  } else if (inquiry === 'Software solutions') {
    add('Project Type', intake.projectType);
    add('Tech Stack', intake.techStack);
  } else if (inquiry === 'Media solutions') {
    add('Content Type', intake.contentType);
    add('Deliverables', intake.deliverables);
    add('Style References', intake.styleReferences);
  }
  add('Budget', intake.budgetRange);
  add('Timeline', intake.timeline);

  if (rows.length === 0) return '';
  return `
    <tr>
      <td style="padding:28px 40px 0;">
        <p style="margin:0 0 12px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#999999;font-weight:500;">Sourcing Parameters</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #eeeeee;padding-top:8px;">
          ${rows.join('')}
        </table>
      </td>
    </tr>`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, inquiry, message, intake } = body as {
      name: string;
      email: string;
      inquiry: string;
      message: string;
      intake?: IntakeFields;
    };

    if (!name || !email || !inquiry || !message) {
      return NextResponse.json(
        { success: false, message: 'All fields are required.' },
        { status: 400 }
      );
    }

    const intakeSummary = intake ? formatIntakeSummary(inquiry, intake) : '';
    const intakeHtml = intake ? formatIntakeHtml(inquiry, intake) : '';

    const timestamp = new Date().toLocaleString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
    });

    const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Message — Deeptech</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e8e8e8;">

          <!-- Header -->
          <tr>
            <td style="background:#111111;padding:32px 40px;">
              <p style="margin:0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#888888;font-weight:500;">Deeptech</p>
              <h1 style="margin:8px 0 0;font-size:22px;font-weight:600;color:#ffffff;letter-spacing:-0.02em;">New Message Received</h1>
            </td>
          </tr>

          <!-- Sender Info -->
          <tr>
            <td style="padding:36px 40px 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:50%;padding-right:16px;vertical-align:top;">
                    <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#999999;font-weight:500;">From</p>
                    <p style="margin:0;font-size:15px;color:#111111;font-weight:600;">${name}</p>
                  </td>
                  <td style="width:50%;padding-left:16px;vertical-align:top;">
                    <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#999999;font-weight:500;">Reply To</p>
                    <a href="mailto:${email}" style="margin:0;font-size:15px;color:#111111;font-weight:500;text-decoration:underline;">${email}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Inquiry Type -->
          <tr>
            <td style="padding:28px 40px 0;">
              <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#999999;font-weight:500;">Inquiry Type</p>
              <p style="margin:0;font-size:15px;color:#111111;font-weight:600;">${inquiry}</p>
            </td>
          </tr>

          ${intakeHtml}

          <!-- Divider -->
          <tr>
            <td style="padding:28px 40px 0;">
              <hr style="border:none;border-top:1px solid #eeeeee;margin:0;" />
            </td>
          </tr>

          <!-- Message Body -->
          <tr>
            <td style="padding:28px 40px 0;">
              <p style="margin:0 0 12px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#999999;font-weight:500;">Message</p>
              <p style="margin:0;font-size:15px;color:#333333;line-height:1.7;white-space:pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:36px 40px;">
              <a href="mailto:${email}?subject=Re: Your message to Deeptech"
                style="display:inline-block;background:#111111;color:#ffffff;font-size:13px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;text-decoration:none;padding:14px 28px;">
                Reply to ${name.split(' ')[0]}
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
                      Received via <strong style="color:#888888;">deeptech.com/contact</strong><br />
                      ${timestamp}
                    </p>
                  </td>
                  <td align="right">
                    <p style="margin:0;font-size:11px;color:#cccccc;letter-spacing:0.15em;text-transform:uppercase;">Deeptech</p>
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
      from: 'Deeptech <onboarding@resend.dev>',
      to: '1deeptechnology@gmail.com',
      replyTo: email,
      subject: `[${inquiry}] New message from ${name}`,
      text: `From: ${name}\nEmail: ${email}\nInquiry: ${inquiry}${intakeSummary ? `\n\nSourcing Parameters:\n${intakeSummary}` : ''}\n\n${message}\n\n---\nReceived ${timestamp}`,
      html: htmlTemplate,
    });

    if (error) {
      console.error('[contact] Resend error:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to send — please try again later.' },
        { status: 500 }
      );
    }

    /* Fire-and-forget: forward structured data to Nimbus for sourcing */
    const nimbusRequestId = forwardToNimbus({ name, email, inquiry, message, intake });
    console.log(`[contact] Nimbus sourcing initiated: ${nimbusRequestId}`);

    return NextResponse.json({ success: true, message: 'Message sent!' });
  } catch (err) {
    console.error('[contact] Unexpected error:', err);
    return NextResponse.json(
      { success: false, message: 'Something went wrong.' },
      { status: 500 }
    );
  }
}
