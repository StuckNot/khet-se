/**
 * ┌──────────────────────────────────────────────────────────────────────────────â” 
 * │  Farm and Friends — Main Navigation Bar                                      │
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
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSelectionStore } from "@/store/selectionStore";
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { getSelectedCount, toggleDrawer } = useSelectionStore();
  const itemCount = getSelectedCount();
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
    // { name: "Subscription Plans", href: "/subscriptions" },
    { name: "Our Story", href: "/story" },
    // { name: "The Farm", href: "/farm" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-brand-green/15 text-brand-primary text-xs py-2 border-b border-brand-green/20 overflow-hidden relative">
        {/* Mobile Marquee (Visible only on small screens) */}
        <div className="block sm:hidden whitespace-nowrap overflow-hidden">
          <div className="animate-marquee flex w-max min-w-full">
            {/* First Set */}
            <div className="flex items-center gap-2 pr-8 shrink-0">
              <span className="inline-block w-2 h-2 rounded-full bg-brand-accent animate-pulse shrink-0 ml-4" />
              <span className="font-semibold tracking-wide text-xs">
                Fresh Batch Milling: Delivered from farm to pantry in &lt; 7 days
              </span>
              <span className="inline-block text-brand-green font-bold px-1">•</span>
              <span className="inline-block text-brand-secondary">
                Free delivery on all monthly subscriptions
              </span>
            </div>
            {/* Second Set (Duplicate for seamless loop) */}
            <div className="flex items-center gap-2 pr-8 shrink-0">
              <span className="inline-block w-2 h-2 rounded-full bg-brand-accent animate-pulse shrink-0 ml-4" />
              <span className="font-semibold tracking-wide text-xs">
                Fresh Batch Milling: Delivered from farm to pantry in &lt; 7 days
              </span>
              <span className="inline-block text-brand-green font-bold px-1">•</span>
              <span className="inline-block text-brand-secondary">
                Free delivery on all monthly subscriptions
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Static (Visible only on sm and above) */}
        <div className="hidden sm:flex max-w-7xl mx-auto items-center justify-between px-4">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span className="inline-block w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
            <span className="font-semibold tracking-wide text-xs">
              Fresh Batch Milling: Delivered from farm to pantry in &lt; 7 days
            </span>
            <span className="hidden md:inline-block text-brand-green font-bold">•</span>
            <span className="hidden md:inline-block text-brand-secondary">
              Free delivery on all monthly subscriptions
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-3 text-brand-primary text-[11px] uppercase tracking-wider font-semibold">
            <span className="flex items-center gap-1 text-success">
              <SproutIcon className="w-3.5 h-3.5" /> 100% Chemical-Free
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
              <Link href="/" className="group focus:outline-none">
                <Image
                  src="/images/logo/f&f logo.png"
                  alt="Farm and Friends"
                  width={140}
                  height={48}
                  priority
                  className="object-contain h-12 w-auto group-hover:opacity-80 transition-opacity duration-200"
                />
                {/* <span className="font-sans text-xs tracking-widest text-brand-green uppercase font-bold">
                  खेत से
                </span> */}
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

              {/* Selected Items Button */}
              <button
                onClick={() => toggleDrawer()}
                className="relative flex items-center justify-center gap-2 bg-transparent hover:bg-brand-beige text-brand-primary border border-brand-secondary/25 p-2 sm:px-3.5 sm:py-2 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer"
                aria-label="Selected Items"
              >
                <BagIcon className="w-5 h-5 sm:hidden text-brand-secondary" />
                <ChecklistIcon className="hidden sm:block w-4 h-4 text-brand-secondary" />
                <span className="hidden sm:inline font-medium text-xs sm:text-sm tracking-wide">Selected Items</span>
                {mounted && itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 sm:relative sm:top-0 sm:right-0 bg-brand-accent text-white text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 sm:px-2 rounded-full sm:ml-0.5 shadow-sm">
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
              <div className="pt-3 border-t border-brand-beige flex items-center justify-between px-3" />
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

const ChecklistIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 11 3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

export default Navbar;
