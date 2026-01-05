import React from 'react';

export function isCompanyVerified(company) {
  if (!company) return false;
  const status = String(company.verification_status || '').toLowerCase();
  return Boolean(company.verified || company.blue_tick) || status === 'verified' || status === 'approved';
}

export default function VerifiedBadge({ company, label = 'Verified' }) {
  if (!isCompanyVerified(company)) return null;
  return (
    <span className="verifiedBadge" aria-label={label} title={label}>
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M20 6L9 17l-5-5"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>{label}</span>
    </span>
  );
}
