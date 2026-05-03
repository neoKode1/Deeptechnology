'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import type { Vendor } from '@/data/vendors';
import { defaultRecipient } from '@/lib/outreach/defaults';
import InquiryComposer from './InquiryComposer';

/**
 * Compact per-product / per-line-item inquiry trigger.
 *
 * Renders a single small button that opens the InquiryComposer pre-filled
 * with a specific product. Designed to live inside dense table rows where
 * the full QuickInquiryMenu (with its dropdown chevron) would be too heavy.
 *
 * If the vendor has no mailto contact on file, the button is hidden by
 * default; pass `forceShow` to render a disabled button with a hover hint
 * instead (useful in surfaces where the operator expects every line to
 * have something they can click).
 */
interface Props {
  vendor: Vendor;
  /** Optional product name to pre-select in the composer. */
  productName?: string;
  /** Visible label. Defaults to "Inquire". */
  label?: string;
  /** Override classes for the trigger button. */
  className?: string;
  /** When true, render disabled (with tooltip) instead of returning null. */
  forceShow?: boolean;
  /** Bumped after a successful send so parents can refresh outreach views. */
  onSent?: () => void;
}

const DEFAULT_CLASSES =
  'inline-flex items-center gap-1 text-xs text-emerald-400/80 hover:text-emerald-300 transition disabled:opacity-40 disabled:cursor-not-allowed';

export default function ProductInquiryButton({
  vendor,
  productName,
  label = 'Inquire',
  className = DEFAULT_CLASSES,
  forceShow = false,
  onSent,
}: Props) {
  const [open, setOpen] = useState(false);
  const hasEmail = !!defaultRecipient(vendor);

  if (!hasEmail && !forceShow) return null;

  const title = hasEmail
    ? `Send a sourcing inquiry to ${vendor.name}${productName ? ` about ${productName}` : ''}`
    : `${vendor.name} has no mailto contact on file`;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={!hasEmail}
        title={title}
        className={className}
      >
        <Send size={11} /> {label}
      </button>
      {open && (
        <InquiryComposer
          vendor={vendor}
          initialProductName={productName}
          onClose={() => setOpen(false)}
          onSent={() => {
            onSent?.();
            // Composer keeps itself open on success so the operator sees the
            // confirmation banner; closing is left to the X button.
          }}
        />
      )}
    </>
  );
}
