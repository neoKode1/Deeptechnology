import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — Deep Tech',
  description: 'Terms of service for deeptech.varyai.link',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-[#333]">
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-24">
        <Link href="/" className="text-xs uppercase tracking-[0.2em] text-[#999] hover:text-[#111] transition-colors font-manrope">
          ← Back to Home
        </Link>

        <h1 className="font-manrope font-semibold text-4xl md:text-5xl tracking-tight text-[#111] mt-8 mb-12">
          Terms of Service
        </h1>

        <div className="flex flex-col gap-8 text-base leading-relaxed">
          <p className="text-sm text-[#999] uppercase tracking-widest font-manrope">
            Last updated: April 2026
          </p>

          <section>
            <h2 className="font-manrope font-semibold text-lg text-[#111] mb-3">1. Services</h2>
            <p>Deep Tech provides software development, robotics consulting, and creative production services. Specific deliverables, timelines, and pricing are defined in individual quotes and agreements issued to each client.</p>
          </section>

          <section>
            <h2 className="font-manrope font-semibold text-lg text-[#111] mb-3">2. Quotes & Payment</h2>
            <p>Quotes provided through our platform are valid for 30 days unless otherwise stated. Accepting a quote and completing payment through our Stripe-powered checkout constitutes agreement to the scope described in that quote. All payments are in USD unless specified otherwise.</p>
          </section>

          <section>
            <h2 className="font-manrope font-semibold text-lg text-[#111] mb-3">3. Intellectual Property</h2>
            <p>Upon full payment, clients receive ownership of custom deliverables produced for their project. Deep Tech retains ownership of proprietary tools, frameworks, and methodologies used during production. Pre-existing third-party assets (open-source libraries, vendor hardware, etc.) remain subject to their respective licenses.</p>
          </section>

          <section>
            <h2 className="font-manrope font-semibold text-lg text-[#111] mb-3">4. Cancellation & Refund Policy</h2>
            <p>Customers may cancel a confirmed work order within <strong>72 hours</strong> of payment. Cancellation requests submitted within this window will receive a partial refund of vendor costs only. Deep Tech&apos;s service fee (the markup above vendor costs, typically 15–20%) is <strong>non-refundable</strong> under any circumstances, as it covers project coordination, vendor management, and administrative costs incurred upon order confirmation.</p>
            <p className="mt-2">After the 72-hour window has closed, cancellations may only be processed by contacting Deep Tech directly. Refund amounts for late cancellations are determined on a case-by-case basis and may be reduced or denied depending on vendor commitments already made.</p>
            <p className="mt-2">Refunds are issued to the original payment method and typically appear within 5–10 business days.</p>
          </section>

          <section>
            <h2 className="font-manrope font-semibold text-lg text-[#111] mb-3">5. Limitation of Liability</h2>
            <p>Deep Tech provides services &quot;as is&quot; and makes no warranties beyond what is expressly stated in a signed agreement. Our liability is limited to the amount paid for the specific service in question.</p>
          </section>

          <section>
            <h2 className="font-manrope font-semibold text-lg text-[#111] mb-3">6. Third-Party Services</h2>
            <p>We integrate with third-party platforms including Stripe (payments), Resend (email), and various robotics vendors. Your use of these services is subject to their respective terms and privacy policies.</p>
          </section>

          <section>
            <h2 className="font-manrope font-semibold text-lg text-[#111] mb-3">7. Modifications</h2>
            <p>We reserve the right to update these terms at any time. Continued use of our site and services constitutes acceptance of any changes.</p>
          </section>

          <section>
            <h2 className="font-manrope font-semibold text-lg text-[#111] mb-3">8. Contact</h2>
            <p>Questions about these terms? Reach us at{' '}
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

