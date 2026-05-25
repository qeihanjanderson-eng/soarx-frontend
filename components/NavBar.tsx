'use client';

import Image from 'next/image';

export default function NavBar() {
  return (
    <nav className="glass-panel m-4 p-4 flex items-center justify-between gap-4 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 bg-cyan-500/15 rounded-2xl p-2 ring-1 ring-cyan-300/20">
          <Image
            src="/soarx-logo.svg"
            alt="SoarX Tax & Advisory Logo"
            fill
            priority
            className="object-contain"
          />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-cyan-200/70">SoarX Copilot</p>
          <h1 className="text-xl font-semibold text-white">Finance Intelligence</h1>
        </div>
      </div>
      <div className="text-right text-sm text-white/70">
        <p className="font-medium">Secure insights with AI</p>
      </div>
    </nav>
  );
}
