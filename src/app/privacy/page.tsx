import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Deep Tech',
  description: 'Privacy policy for deeptechnologies.dev',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-[#333]">
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-24">
        <Link href="/" className="text-xs uppercase tracking-[0.2em] text-[#999] hover:text-[#111] transition-colors font-manrope">
          ← Back to Home
        </Link>

        <h1 className="font-manrope font-semibold text-4xl md:text-5xl tracking-tight text-[#111] mt-8 mb-12">
          Privacy Policy
        </h1>

        <div className="flex flex-col gap-8 text-base leading-relaxed">
          <p className="text-sm text-[#999] uppercase tracking-widest font-manrope">
            Last updated: April 2026
          </p>

          <section>
            <h2 className="font-manrope font-semibold text-lg text-[#111] mb-3">1. Information We Collect</h2>
            <p>When you use our contact form, request a quote, or interact with our AI assistant (Nimbus), we may collect your name, email address, and the details of your inquiry. If you provide your email during a Nimbus chat session, it is stored to enable follow-up and to provide continuity in your consultation. We do not collect personal data beyond what you voluntarily provide.</p>
          </section>

          <section>
            <h2 className="font-manrope font-semibold text-lg text-[#111] mb-3">2. AI Chat & Conversation Data</h2>
            <p>Our AI assistant (Nimbus) is powered by Anthropic Claude. Conversation histories are stored in an encrypted, temporary cache for up to 7 days to provide session continuity. If you share an email address during a chat session, it is used solely to follow up on your inquiry and is not shared with third parties or used for marketing without your consent. We do not train AI models on your conversation content.</p>
          </section>

          <section>
            <h2 className="font-manrope font-semibold text-lg text-[#111] mb-3">3. How We Use Your Information</h2>
            <p>We use the information you provide to respond to inquiries, generate quotes, process payments through Stripe, and communicate about our services. We do not sell, rent, or share your personal data with third parties for marketing purposes.</p>
          </section>

          <section>
            <h2 className="font-manrope font-semibold text-lg text-[#111] mb-3">4. Payment Processing</h2>
            <p>Payments are processed securely through Stripe. We do not store credit card numbers or sensitive payment details on our servers. All payment data is handled directly by Stripe in accordance with PCI-DSS standards.</p>
          </section>

          <section>
            <h2 className="font-manrope font-semibold text-lg text-[#111] mb-3">5. Cookies & Analytics</h2>
            <p>This site uses essential cookies required for functionality. We may use privacy-respecting analytics to understand site usage. No third-party advertising trackers are used.</p>
          </section>

          <section>
            <h2 className="font-manrope font-semibold text-lg text-[#111] mb-3">6. Data Retention</h2>
            <p>We retain your information only as long as necessary to fulfill the purposes outlined in this policy or as required by law. You may request deletion of your data at any time by contacting us.</p>
          </section>

          <section>
            <h2 className="font-manrope font-semibold text-lg text-[#111] mb-3">7. Cancellation & Refund Data</h2>
            <p>When you cancel an order, we retain the cancellation record (reason, refund amount, and timestamp) as part of your order history. Stripe processes and retains refund transaction data in accordance with their privacy policy and PCI-DSS requirements. We do not store your payment card details at any point.</p>
          </section>

          <section>
            <h2 className="font-manrope font-semibold text-lg text-[#111] mb-3">8. Third-Party Data Processors</h2>
            <p>We use the following sub-processors to operate our services. Each is bound by their own data protection agreements:</p>
            <ul className="mt-3 space-y-2 text-sm list-disc list-inside text-[#555]">
              <li><strong>Anthropic</strong> — AI inference for Nimbus chat. Conversation data is processed under Anthropic&apos;s API privacy terms. We have disabled training data sharing.</li>
              <li><strong>Stripe</strong> — Payment processing. Handles all card data under PCI-DSS Level 1. Stripe does not share your card details with us.</li>
              <li><strong>Upstash (Redis)</strong> — Encrypted in-memory cache for session management, rate limiting, and temporary lead storage (7-day TTL).</li>
              <li><strong>Resend</strong> — Transactional email delivery for quote confirmations and ROI reports.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-manrope font-semibold text-lg text-[#111] mb-3">9. Your Rights (GDPR / CCPA)</h2>
            <p>Depending on where you are located, you may have the following rights regarding your personal data:</p>
            <ul className="mt-3 space-y-2 text-sm list-disc list-inside text-[#555]">
              <li><strong>Access</strong> — Request a copy of the personal data we hold about you.</li>
              <li><strong>Deletion</strong> — Request that we delete your personal data. Chat session data and email leads are deleted automatically after 7 days.</li>
              <li><strong>Portability</strong> — Request your data in a portable format.</li>
              <li><strong>Opt-out (CCPA)</strong> — California residents may opt out of the sale of personal information. We do not sell personal data.</li>
              <li><strong>Correction</strong> — Request correction of inaccurate data we hold about you.</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, contact us at <a href="mailto:info@deeptechnologies.dev" className="text-[#111] font-medium underline underline-offset-4">info@deeptechnologies.dev</a>. We will respond within 30 days.</p>
          </section>

          <section>
            <h2 className="font-manrope font-semibold text-lg text-[#111] mb-3">10. Contact</h2>
            <p>For privacy-related inquiries, contact us at{' '}
              <a href="mailto:info@deeptechnologies.dev" className="text-[#111] font-medium underline underline-offset-4 hover:text-black">
                info@deeptechnologies.dev
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

