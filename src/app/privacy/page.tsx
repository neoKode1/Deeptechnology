import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Deep Tech',
  description: 'Privacy policy for deeptech.varyai.link',
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
            <p>When you use our contact form or request a quote, we collect your name, email address, and the details of your inquiry. We do not collect personal data beyond what you voluntarily provide.</p>
          </section>

          <section>
            <h2 className="font-manrope font-semibold text-lg text-[#111] mb-3">2. How We Use Your Information</h2>
            <p>We use the information you provide to respond to inquiries, generate quotes, process payments through Stripe, and communicate about our services. We do not sell, rent, or share your personal data with third parties for marketing purposes.</p>
          </section>

          <section>
            <h2 className="font-manrope font-semibold text-lg text-[#111] mb-3">3. Payment Processing</h2>
            <p>Payments are processed securely through Stripe. We do not store credit card numbers or sensitive payment details on our servers. All payment data is handled directly by Stripe in accordance with PCI-DSS standards.</p>
          </section>

          <section>
            <h2 className="font-manrope font-semibold text-lg text-[#111] mb-3">4. Cookies & Analytics</h2>
            <p>This site uses essential cookies required for functionality. We may use privacy-respecting analytics to understand site usage. No third-party advertising trackers are used.</p>
          </section>

          <section>
            <h2 className="font-manrope font-semibold text-lg text-[#111] mb-3">5. Data Retention</h2>
            <p>We retain your information only as long as necessary to fulfill the purposes outlined in this policy or as required by law. You may request deletion of your data at any time by contacting us.</p>
          </section>

          <section>
            <h2 className="font-manrope font-semibold text-lg text-[#111] mb-3">6. Cancellation & Refund Data</h2>
            <p>When you cancel an order, we retain the cancellation record (reason, refund amount, and timestamp) as part of your order history. Stripe processes and retains refund transaction data in accordance with their privacy policy and PCI-DSS requirements. We do not store your payment card details at any point.</p>
          </section>

          <section>
            <h2 className="font-manrope font-semibold text-lg text-[#111] mb-3">7. Contact</h2>
            <p>For privacy-related inquiries, contact us at{' '}
              <a href="mailto:info@varyai.link" className="text-[#111] font-medium underline underline-offset-4 hover:text-black">
                info@varyai.link
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

