"use client";

import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-brand-primary text-brand-canvas py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand Mission */}
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold mb-4 tracking-tight">KhetSe</h2>
            <p className="text-sm opacity-80 leading-relaxed max-w-xs">
              Organic, farm-to-table staples delivered directly from our soil to your doorstep. Pure, sustainable, and transparent.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 opacity-60">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/shop" className="hover:text-brand-accent transition-colors">Shop All</Link></li>
              <li><Link href="/trial-kits" className="hover:text-brand-accent transition-colors">Trial Kits</Link></li>
              <li><Link href="/subscriptions" className="hover:text-brand-accent transition-colors">Subscription Plans</Link></li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 opacity-60">About</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/story" className="hover:text-brand-accent transition-colors">Our Story</Link></li>
              <li><Link href="/farm" className="hover:text-brand-accent transition-colors">The Farm</Link></li>
              <li><Link href="/contact" className="hover:text-brand-accent transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 opacity-60">Newsletter</h3>
            <p className="text-sm opacity-80 mb-4">Join our community for farm updates and recipes.</p>
            <form className="flex flex-col space-y-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-brand-canvas/10 border border-brand-canvas/20 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-brand-accent transition-colors"
                required
              />
              <button
                type="submit"
                className="bg-brand-secondary hover:bg-brand-secondary/90 text-brand-canvas font-medium py-2 rounded-md text-sm transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-brand-canvas/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs opacity-60">
            © {new Date().getFullYear()} KhetSe. All rights reserved.
          </p>
          <div className="flex space-x-6 text-xs opacity-60">
            <Link href="/privacy" className="hover:text-brand-accent">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-brand-accent">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
