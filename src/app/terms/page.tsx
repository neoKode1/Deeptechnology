import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — Deep Tech',
  description: 'Terms of service for deeptechnologies.dev',
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
            <h2 className="font-manrope font-semibold text-lg text-[#111] mb-3">5. Robot Requisition &amp; Insurance Requirements</h2>
            <p>Any client requisitioning autonomous robots, delivery droids, drones, or related hardware through Deep Tech&apos;s platform must maintain, at minimum, the following insurance coverage prior to deployment and throughout the operational period:</p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-[#444]">
              <li><strong>Commercial General Liability (CGL)</strong> — minimum <strong>$1,000,000</strong> per occurrence / $2,000,000 aggregate. Required for all hardware deployments in public or semi-public environments.</li>
              <li><strong>Public Liability</strong> — minimum <strong>$1,000,000</strong> per incident covering bodily injury or property damage caused by or involving any autonomous unit sourced through Deep Tech.</li>
              <li><strong>Cyber &amp; Technology Liability</strong> — minimum <strong>$500,000</strong>, covering data breaches, unauthorized access to robot control systems, and transmission failures resulting in physical or operational harm.</li>
              <li><strong>Goods-in-Transit / Inland Marine</strong> — required for units shipped across state lines or internationally. Coverage must equal or exceed the full replacement value of all hardware in transit.</li>
              <li><strong>Umbrella / Excess Liability</strong> — for deployments in states with autonomous vehicle regulations (including but not limited to Washington, California, and Texas), clients must carry an umbrella policy of at least <strong>$5,000,000</strong> where required by applicable law.</li>
            </ul>
            <p className="mt-3">Proof of insurance (certificate of coverage naming Deep Tech as an additional insured) may be required before order confirmation or hardware handoff. Deep Tech reserves the right to pause or cancel any requisition where minimum coverage cannot be verified.</p>
            <p className="mt-2">For Robot-as-a-Service (RaaS) subscription agreements, the above requirements apply for each billing period. Lapse in coverage may result in immediate suspension of the subscription and retrieval of hardware at the client&apos;s expense.</p>
          </section>

          <section>
            <h2 className="font-manrope font-semibold text-lg text-[#111] mb-3">6. Operator Responsibility</h2>
            <p>The client, upon acceptance of a quote or activation of a RaaS subscription, assumes full responsibility as the <strong>operator of record</strong> for any autonomous unit deployed under their account. This includes:</p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-[#444]">
              <li>Compliance with all federal, state, and local regulations governing the operation of autonomous ground vehicles, delivery robots, and unmanned aerial vehicles (UAVs) in the deployment jurisdiction.</li>
              <li>Obtaining any necessary permits, right-of-way agreements, or municipal licenses required for public sidewalk or airspace operation.</li>
              <li>Ensuring that all personnel interacting with or supervising autonomous units are adequately trained and authorized.</li>
              <li>Promptly reporting any accident, collision, or malfunction involving a deployed unit to Deep Tech and, where required, to the relevant regulatory authority.</li>
              <li>Maintaining the unit in accordance with vendor-specified maintenance schedules. Any modification to hardware or software that voids the manufacturer warranty must be disclosed to Deep Tech in writing.</li>
            </ul>
            <p className="mt-3">Deep Tech acts as a <strong>sourcing and coordination intermediary</strong> and is not the manufacturer, operator, or insurer of any autonomous hardware. Deep Tech bears no liability for injuries, property damage, regulatory fines, or losses arising from a client&apos;s operation of requisitioned units, except where caused by Deep Tech&apos;s own gross negligence or willful misconduct.</p>
          </section>

          <section>
            <h2 className="font-manrope font-semibold text-lg text-[#111] mb-3">7. Limitation of Liability</h2>
            <p>Deep Tech provides services &quot;as is&quot; and makes no warranties beyond what is expressly stated in a signed agreement. Our liability is limited to the amount paid for the specific service in question.</p>
          </section>

          <section>
            <h2 className="font-manrope font-semibold text-lg text-[#111] mb-3">8. Third-Party Services</h2>
            <p>We integrate with third-party platforms including Stripe (payments), Resend (email), and various robotics vendors. Your use of these services is subject to their respective terms and privacy policies.</p>
          </section>

          <section>
            <h2 className="font-manrope font-semibold text-lg text-[#111] mb-3">9. Modifications</h2>
            <p>We reserve the right to update these terms at any time. Continued use of our site and services constitutes acceptance of any changes.</p>
          </section>

          <section>
            <h2 className="font-manrope font-semibold text-lg text-[#111] mb-3">10. Contact</h2>
            <p>Questions about these terms? Reach us at{' '}
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

