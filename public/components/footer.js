function footer() {
    return `
    <footer class="mt-16 border-t border-[#2A2A2A] bg-[#0A0A0A]">

        <div class="max-w-7xl mx-auto px-6 py-10">

            <div class="flex flex-col items-center text-center md:flex-row md:justify-between md:items-start md:text-left gap-8">

                <div>

                    <h2 class="text-xl font-semibold text-white">
                        Giveth POS
                    </h2>

                    <p class="mt-2 text-sm text-gray-400 max-w-sm">
                        Fast, secure and reliable Point of Sale software
                        built for restaurants, bars and growing businesses.
                    </p>

                </div>

                <div>

                    <h3 class="text-white font-medium mb-3">
                        Quick Links
                    </h3>

                    <div class="flex flex-col gap-2">

                        <a href="/" class="text-gray-400 hover:text-[#D4AF37] transition">
                            Home
                        </a>

                        <a href="/contact-admin" class="text-gray-400 hover:text-[#D4AF37] transition">
                            Contact Admin
                        </a>

                    </div>

                </div>

            </div>

            <div class="mt-8 pt-6 border-t border-[#2A2A2A] text-center">

                <p class="text-sm text-gray-500">
                    © 2026 Giveth POS. All rights reserved.
                </p>

            </div>

        </div>

    </footer>
    `;
}