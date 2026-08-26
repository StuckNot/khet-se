/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │  KhetSe — Main Navigation Bar                                                │
 * │  File: app/components/Navbar.tsx                                             │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  Responsive top navigation bar. Includes an announcement bar, brand logo     │
 * │  with Hindi tagline, expanded navigation links with active-state underlines, │
 * │  auth state toggling, and the "Pantry Box" cart toggle with item count.       │
 * │                                                                              │
 * │  WHY "use client"?                                                           │
 * │  It uses React state for the mobile hamburger menu, scroll-aware styling,    │
 * │  usePathname for active link detection, and consumes the Zustand cart store.  │
 * │                                                                              │
 * │  PROPS:                                                                      │
 * │  - user: The Supabase User object, passed down from the root layout (RSC)    │
 * │    to determine auth state without doing a client-side fetch.                │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { signout } from "../(shop)/login/actions";
import { useCartStore } from "@/store/cartStore";

interface NavbarProps {
  user: User | null;
}

const Navbar = ({ user }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { getItemCount, toggleDrawer } = useCartStore();
  const itemCount = getItemCount();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Shop All", href: "/shop" },
    { name: "Trial Kits", href: "/trial-kits", badge: "Starter" },
    { name: "Subscription Plans", href: "/subscriptions" },
    { name: "Our Story", href: "/story" },
    { name: "The Farm", href: "/farm" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-brand-green/15 text-brand-primary text-xs py-2 px-4 border-b border-brand-green/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span className="inline-block w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
            <span className="font-semibold tracking-wide text-xs">
              Fresh Batch Milling: Delivered from farm to pantry in &lt; 48 hours
            </span>
            <span className="hidden md:inline-block text-brand-green font-bold">•</span>
            <span className="hidden md:inline-block text-brand-secondary">
              Free nationwide delivery on all monthly subscriptions
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-3 text-brand-primary text-[11px] uppercase tracking-wider font-semibold">
            <span className="flex items-center gap-1 text-success">
              <SproutIcon className="w-3.5 h-3.5" /> 100% Certified Organic Soil
            </span>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-brand-canvas/95 backdrop-blur-md shadow-sm border-b border-brand-beige"
            : "bg-brand-canvas border-b border-brand-beige/60"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Brand Logo */}
            <div className="flex items-center gap-3">
              <Link href="/" className="group text-left focus:outline-none">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl sm:text-4xl text-brand-primary tracking-tight group-hover:text-brand-secondary transition-colors">
                    KhetSe
                  </span>
                  <span className="font-sans text-xs tracking-widest text-brand-green uppercase font-bold">
                    खेत से
                  </span>
                </div>
                <p className="text-[10px] tracking-wider text-brand-secondary/80 uppercase -mt-1 font-medium">
                  Farm-to-Pantry Staples
                </p>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-brand-primary">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`py-1 relative group transition-colors flex items-center gap-1.5 ${
                      isActive ? "text-brand-accent font-semibold" : "hover:text-brand-accent"
                    }`}
                  >
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="bg-brand-green/20 text-success text-[10px] px-2 py-0.5 rounded-full font-bold">
                        {link.badge}
                      </span>
                    )}
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 bg-brand-accent transition-all duration-200 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-3 sm:gap-4">

              {/* Auth */}
              {user ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/account"
                    className="flex items-center gap-2 text-xs sm:text-sm font-medium text-brand-primary hover:text-brand-accent px-3 py-2 rounded-lg hover:bg-brand-beige transition-colors"
                    aria-label="Account"
                  >
                    <UserIcon className="w-4 h-4 text-brand-secondary" />
                    <span className="hidden sm:inline">Account</span>
                  </Link>
                  <form action={signout}>
                    <button
                      type="submit"
                      className="text-xs font-bold text-brand-primary/60 hover:text-brand-primary transition-colors"
                    >
                      Sign Out
                    </button>
                  </form>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 text-xs sm:text-sm font-medium text-brand-primary hover:text-brand-accent px-3 py-2 rounded-lg hover:bg-brand-beige transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-brand-secondary" />
                  <span className="hidden sm:inline">Log In</span>
                </Link>
              )}

              {/* Cart "Pantry Box" Button */}
              <button
                onClick={() => toggleDrawer()}
                className="relative flex items-center gap-2 bg-transparent hover:bg-brand-beige text-brand-primary border border-brand-secondary/25 px-3.5 py-2 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer"
                aria-label="Cart"
              >
                <BagIcon className="w-4 h-4 text-brand-secondary" />
                <span className="font-medium text-xs sm:text-sm tracking-wide">Pantry Box</span>
                {mounted && itemCount > 0 && (
                  <span className="bg-brand-accent text-white text-[11px] font-bold px-2 py-0.5 rounded-full ml-0.5">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-2 text-brand-primary hover:bg-brand-beige rounded-lg cursor-pointer"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle Navigation Menu"
              >
                {isMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="md:hidden bg-brand-canvas border-b border-brand-beige px-4 pt-2 pb-6 space-y-2 shadow-lg">
            <div className="flex flex-col space-y-1 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2.5 text-base font-medium rounded-lg flex items-center justify-between ${
                    pathname === link.href
                      ? "bg-brand-beige text-brand-accent font-bold"
                      : "text-brand-primary hover:bg-brand-beige/60"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="bg-brand-green/20 text-success text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
              <div className="pt-3 border-t border-brand-beige flex items-center justify-between px-3">
                {user ? (
                  <div className="flex items-center gap-4">
                    <Link
                      href="/account"
                      className="flex items-center gap-2 text-sm font-medium text-brand-primary py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserIcon className="w-4 h-4 text-brand-secondary" />
                      <span>My Account</span>
                    </Link>
                    <form action={signout} onSubmit={() => setIsMenuOpen(false)}>
                      <button
                        type="submit"
                        className="text-sm font-medium text-red-600"
                      >
                        Sign Out
                      </button>
                    </form>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-2 text-sm font-medium text-brand-primary py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserIcon className="w-4 h-4 text-brand-secondary" />
                    <span>Log In / Subscribe</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

// --- Icons ---

const MenuIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const BagIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const SproutIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7 20h10" />
    <path d="M10 20c5.5-2.5.8-6.4 3-10" />
    <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
    <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
  </svg>
);

export default Navbar;
