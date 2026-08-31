"use client";

import React, { useState } from "react";
import Link from "next/link";

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail("");
      setIsSubscribed(false);
    }, 4000);
  };

  const bgImage = "url('/images/footer-bg-vintage.jpg')";

  // Exact restored style from Variation B
  const beforeB = `
    content: ""; position: absolute; inset: 0; 
    background-image: ${bgImage}; background-size: 100% auto; background-position: bottom;
    background-repeat: no-repeat; opacity: 0.35; mix-blend-mode: multiply; pointer-events: none;
    -webkit-mask-image: linear-gradient(to bottom, transparent 30%, black 100%);
    mask-image: linear-gradient(to bottom, transparent 30%, black 100%);
  `;

  return (
    <>
      <style>{`.custom-footer-bg::before { ${beforeB} }`}</style>

      <footer className="custom-footer-bg relative bg-brand-beige text-brand-primary pt-16 pb-12 border-t border-brand-secondary/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-brand-secondary/15">

            {/* Col 1: Brand Philosophy (4 cols) */}
            <div className="lg:col-span-4 space-y-4 text-left">
              <Link href="/" className="inline-block">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl text-brand-primary">KhetSe</span>
                  <span className="text-xs text-brand-green uppercase tracking-widest font-bold">खेत से</span>
                </div>
              </Link>
              <p className="text-xs text-brand-secondary leading-relaxed max-w-sm">
                Chemical free, farm-to-table staples delivered directly from our soil to your doorstep. Pure, sustainable, and transparent. Milled to order in under 48 hours.
              </p>
            </div>  

            {/* Col 2: Shop Links (2 cols) */}
            <div className="lg:col-span-2 space-y-3 text-left">
              <h4 className="text-xs uppercase font-bold text-brand-secondary tracking-wider">
                Shop
              </h4>
              <ul className="space-y-2 text-xs text-brand-primary">
                <li>
                  <Link href="/shop" className="hover:text-brand-accent transition-colors">
                    Shop All Staples
                  </Link>
                </li>
                <li>
                  <Link href="/trial-kits" className="hover:text-brand-accent transition-colors">
                    Trial Starter Kits
                  </Link>
                </li>
                <li>
                  <Link href="/subscriptions" className="hover:text-brand-accent transition-colors">
                    Subscription Plans
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: About Links (2 cols) */}
            <div className="lg:col-span-2 space-y-3 text-left">
              <h4 className="text-xs uppercase font-bold text-brand-secondary tracking-wider">
                About &amp; Farm
              </h4>
              <ul className="space-y-2 text-xs text-brand-primary">
                <li>
                  <Link href="/story" className="hover:text-brand-accent transition-colors">
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link href="/farm" className="hover:text-brand-accent transition-colors">
                    The Farm &amp; Soil
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-brand-accent transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/subscriptions" className="hover:text-brand-accent transition-colors">
                    How Subscriptions Work
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Newsletter (4 cols) */}
            <div className="lg:col-span-4 space-y-3 text-left">
              <h4 className="text-xs uppercase font-bold text-brand-secondary tracking-wider">
                Farm Newsletter
              </h4>
              <p className="text-xs text-brand-secondary leading-relaxed">
                Join our community for farm updates and recipes. Receive seasonal harvest alerts and traditional heirloom cooking notes.
              </p>

              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="bg-white/80 backdrop-blur-sm border border-brand-secondary/20 rounded-xl px-3.5 py-2.5 text-xs text-brand-primary placeholder-brand-secondary/60 focus:outline-none focus:border-brand-accent flex-1"
                  />
                  <button
                    type="submit"
                    className="bg-brand-accent hover:bg-brand-accent/85 text-white px-4 py-2.5 rounded-xl text-xs font-medium transition-colors flex items-center gap-1 shrink-0 cursor-pointer shadow-sm"
                  >
                    <span>Subscribe</span>
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </button>
                </div>

                {isSubscribed && (
                  <p className="text-[11px] text-success flex items-center gap-1 font-medium">
                    <CheckCircleIcon className="w-3.5 h-3.5" />
                    Thank you! You&apos;re subscribed to farm harvest dispatches.
                  </p>
                )}
              </form>

              <div className="pt-1 text-[11px] text-brand-secondary">
                Direct dispatch hub: Pune &amp; Bangalore • Delivering to 18,000+ PIN codes across India
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-secondary">
            <div className="shadow-sm px-2 py-1 rounded bg-brand-canvas/20">
              © {new Date().getFullYear()} KhetSe Organics India Pvt Ltd. All rights reserved.
            </div>

            <div className="flex items-center gap-6 shadow-sm px-2 py-1 rounded bg-brand-canvas/20">
              <Link href="/contact" className="hover:text-brand-primary transition-colors">
                Help &amp; Support
              </Link>
              <Link href="/privacy" className="hover:text-brand-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-brand-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
};

// --- Icons ---
const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="m9 11 3 3L22 4" />
  </svg>
);

export default Footer;



// /**
//  * ┌──────────────────────────────────────────────────────────────────────────────â”
//  * │  KhetSe — Site Footer                                                        │
//  * │  File: app/components/Footer.tsx                                             │
//  * ├──────────────────────────────────────────────────────────────────────────────┤
//  * │                                                                              │
//  * │  PURPOSE:                                                                    │
//  * │  Site-wide footer with brand info, organic certification badges, expanded    │
//  * │  navigation links, and a newsletter signup form (no-op, client-side only).   │
//  * │                                                                              │
//  * │  WHY "use client"?                                                           │
//  * │  Uses React state for newsletter email input and visual subscription         │
//  * │  feedback. No backend API call is made.                                      │
//  * └──────────────────────────────────────────────────────────────────────────────┘
//  */

// "use client";

// import React, { useState } from "react";
// import Link from "next/link";

// const Footer = () => {
//   const [newsletterEmail, setNewsletterEmail] = useState("");
//   const [isSubscribed, setIsSubscribed] = useState(false);

//   const handleNewsletterSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newsletterEmail || !newsletterEmail.includes("@")) return;
//     setIsSubscribed(true);
//     setTimeout(() => {
//       setNewsletterEmail("");
//       setIsSubscribed(false);
//     }, 4000);
//   };

//   return (
//     <footer className="bg-brand-beige/70 text-brand-primary pt-16 pb-12 border-t border-brand-secondary/15">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

//         {/* Main Footer Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-brand-secondary/15">

//           {/* Col 1: Brand Philosophy (4 cols) */}
//           <div className="lg:col-span-4 space-y-4 text-left">
//             <Link href="/" className="inline-block">
//               <div className="flex items-baseline gap-2">
//                 <span className="font-display text-3xl text-brand-primary">KhetSe</span>
//                 <span className="text-xs text-brand-green uppercase tracking-widest font-bold">खेत से</span>
//               </div>
//             </Link>
//             <p className="text-xs text-brand-secondary leading-relaxed max-w-sm">
//               Chemical free, farm-to-table staples delivered directly from our soil to your doorstep. Pure, sustainable, and transparent. Milled to order in under 48 hours.
//             </p>
//             {/* <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-brand-primary font-medium">
//               <span className="flex items-center gap-1 text-success">
//                 <SproutIcon className="w-3.5 h-3.5" /> NPOP Certified
//               </span>
//               <span>•</span>
//               <span>Jaivik Bharat</span>
//               <span>•</span>
//               <span>FSSAI 100% Compliant</span>
//             </div> */}
//           </div>  

//           {/* Col 2: Shop Links (2 cols) */}
//           <div className="lg:col-span-2 space-y-3 text-left">
//             <h4 className="text-xs uppercase font-bold text-brand-secondary tracking-wider">
//               Shop
//             </h4>
//             <ul className="space-y-2 text-xs text-brand-primary">
//               <li>
//                 <Link href="/shop" className="hover:text-brand-accent transition-colors">
//                   Shop All Staples
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/trial-kits" className="hover:text-brand-accent transition-colors">
//                   Trial Starter Kits
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/subscriptions" className="hover:text-brand-accent transition-colors">
//                   Subscription Plans
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Col 3: About Links (2 cols) */}
//           <div className="lg:col-span-2 space-y-3 text-left">
//             <h4 className="text-xs uppercase font-bold text-brand-secondary tracking-wider">
//               About &amp; Farm
//             </h4>
//             <ul className="space-y-2 text-xs text-brand-primary">
//               <li>
//                 <Link href="/story" className="hover:text-brand-accent transition-colors">
//                   Our Story
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/farm" className="hover:text-brand-accent transition-colors">
//                   The Farm &amp; Soil
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/contact" className="hover:text-brand-accent transition-colors">
//                   Contact Us
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/subscriptions" className="hover:text-brand-accent transition-colors">
//                   How Subscriptions Work
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Col 4: Newsletter (4 cols) */}
//           <div className="lg:col-span-4 space-y-3 text-left">
//             <h4 className="text-xs uppercase font-bold text-brand-secondary tracking-wider">
//               Farm Newsletter
//             </h4>
//             <p className="text-xs text-brand-secondary leading-relaxed">
//               Join our community for farm updates and recipes. Receive seasonal harvest alerts and traditional heirloom cooking notes.
//             </p>

//             <form onSubmit={handleNewsletterSubmit} className="space-y-2">
//               <div className="flex gap-2">
//                 <input
//                   type="email"
//                   required
//                   value={newsletterEmail}
//                   onChange={(e) => setNewsletterEmail(e.target.value)}
//                   placeholder="Enter your email"
//                   className="bg-brand-canvas border border-brand-secondary/20 rounded-xl px-3.5 py-2.5 text-xs text-brand-primary placeholder-brand-secondary/60 focus:outline-none focus:border-brand-accent flex-1"
//                 />
//                 <button
//                   type="submit"
//                   className="bg-brand-accent hover:bg-brand-accent/85 text-white px-4 py-2.5 rounded-xl text-xs font-medium transition-colors flex items-center gap-1 shrink-0 cursor-pointer shadow-sm"
//                 >
//                   <span>Subscribe</span>
//                   <ArrowRightIcon className="w-3.5 h-3.5" />
//                 </button>
//               </div>

//               {isSubscribed && (
//                 <p className="text-[11px] text-success flex items-center gap-1 font-medium">
//                   <CheckCircleIcon className="w-3.5 h-3.5" />
//                   Thank you! You&apos;re subscribed to farm harvest dispatches.
//                 </p>
//               )}
//             </form>

//             <div className="pt-1 text-[11px] text-brand-secondary">
//               Direct dispatch hub: Pune &amp; Bangalore • Delivering to 18,000+ PIN codes across India
//             </div>
//           </div>

//         </div>

//         {/* Bottom Bar */}
//         <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-secondary">
//           <div>
//             © {new Date().getFullYear()} KhetSe Organics India Pvt Ltd. All rights reserved.
//           </div>

//           <div className="flex items-center gap-6">
//             <Link href="/contact" className="hover:text-brand-primary transition-colors">
//               Help &amp; Support
//             </Link>
//             <Link href="/privacy" className="hover:text-brand-primary transition-colors">
//               Privacy Policy
//             </Link>
//             <Link href="/terms" className="hover:text-brand-primary transition-colors">
//               Terms of Service
//             </Link>
//           </div>
//         </div>

//       </div>
//     </footer>
//   );
// };

// // --- Icons ---

// const SproutIcon = ({ className }: { className?: string }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
//     <path d="M7 20h10" />
//     <path d="M10 20c5.5-2.5.8-6.4 3-10" />
//     <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
//     <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
//   </svg>
// );

// const ArrowRightIcon = ({ className }: { className?: string }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
//     <path d="M5 12h14" />
//     <path d="m12 5 7 7-7 7" />
//   </svg>
// );

// const CheckCircleIcon = ({ className }: { className?: string }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
//     <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
//     <path d="m9 11 3 3L22 4" />
//   </svg>
// );

// export default Footer;
