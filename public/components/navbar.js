function navbar() {
    return `
      <nav
        class="fixed top-0 left-0 z-50 w-full bg-[#0A0A0A] border-b border-[#2A2A2A]"
      >
        <div
          class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between"
        >
          <!-- Logo -->
          <a href="/" class="flex items-center gap-3"> <!-- // fix: Should lead back dashboard -->
            <div
              class="w-9 h-9 rounded-lg bg-[#D4AF37] flex items-center justify-center font-bold text-black"
            >
              <img
                src="../assets/logo.jpg"
                alt="Giveth POS Logo"
                class="w-9 h-9 rounded-lg object-cover"
              />
            </div>

            <div>
              <h1 class="text-white font-bold">Giveth POS</h1>
              <p class="text-xs text-gray-400">Restaurant Management</p>
            </div>
          </a>

          <!-- Hidden checkbox -->
          <input id="menu-toggle" type="checkbox" class="peer hidden" />

          <!-- Hamburger -->
          <label
            for="menu-toggle"
            class="cursor-pointer md:hidden text-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-7 h-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>

          <!-- Desktop Links -->
          <div class="hidden md:flex items-center gap-8">
            <a href="#" class="text-[#D4AF37] font-medium">Home</a>
            <a href="#" class="text-gray-300 hover:text-white">Documentation</a>
            <a href="#" class="text-gray-300 hover:text-white">API Reference</a>
            <a href="#" class="text-gray-300 hover:text-white">GitHub</a>
          </div>

          <!-- Mobile Menu -->
          <div
            class="absolute left-0 top-full hidden w-full bg-[#0A0A0A] border-t border-[#2A2A2A] peer-checked:block md:hidden"
          >
            <div class="flex flex-col px-6 py-4 space-y-4">
              <a href="#" class="text-[#D4AF37]"> Home </a>

              <a href="#" class="text-gray-300 hover:text-white">
                Documentation
              </a>

              <a href="#" class="text-gray-300 hover:text-white">
                API Reference
              </a>

              <a href="#" class="text-gray-300 hover:text-white"> GitHub </a>
            </div>
          </div>
        </div>
      </nav>
`;
}