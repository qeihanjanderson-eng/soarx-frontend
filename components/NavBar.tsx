'use client';

import Image from 'next/image';

export default function NavBar() {
  return (
    <nav className="navbar-bg px-6 py-4 flex items-center border-panel-divider shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="relative w-10 h-10">
          <Image
            src="/soarx-logo.svg"
            alt="SoarX Tax & Advisory Logo"
            fill
            priority
            className="object-contain"
          />
        </div>
        <h1>SoarX Intelligence</h1>
      </div>
    </nav>
  );
}
