'use client';

import Script from 'next/script';
import { useEffect, useRef } from 'react';

export default function TrustpilotWidget() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ((window as any).Trustpilot && ref.current) {
      (window as any).Trustpilot.loadFromElement(ref.current, true);
    }
  }, []);

  return (
    <>
      <Script
        src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          if ((window as any).Trustpilot && ref.current) {
            (window as any).Trustpilot.loadFromElement(ref.current, true);
          }
        }}
      />
      <div className="flex justify-center w-full">
        <div
          ref={ref}
          className="trustpilot-widget"
          data-locale="en-US"
          data-template-id="56278e9abfbbba0bdcd568bc"
          data-businessunit-id="6ab4de8be1f8ebc9a0caf219"
          data-style-height="52px"
          data-style-width="100%"
          data-theme="dark"
          data-token="07365658-59e2-41b8-af71-8b95f7da7408"
          style={{ maxWidth: '480px', width: '100%' }}
        >
          <a href="https://www.trustpilot.com/review/farmandfriends.in" target="_blank" rel="noopener noreferrer">
            Trustpilot
          </a>
        </div>
      </div>
    </>
  );
}