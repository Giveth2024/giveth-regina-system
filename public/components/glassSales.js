export function glassSales() {
  return `
    <div class="rounded-xl border border-[#2F2F2F] bg-[#121212] p-5 shadow-inner">
              <div class="flex items-center justify-between mb-4">
            <h3
              class="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2"
            >
              <svg
                class="w-4 h-4 text-[#D4AF37]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
              Glass Bottle Options
            </h3>
            <span
              class="text-[10px] text-gray-500 uppercase tracking-widest font-semibold"
              >Deposit Settings</span
            >
          </div>

          <div class="grid md:grid-cols-2 gap-5">
            <!-- Status Radio Toggles -->
            <div>
              <label class="block text-xs font-medium text-gray-400 mb-2.5">
                Bottle Service Mode
              </label>

              <div class="grid grid-cols-2 gap-3">
                <!-- Option: Drinking Here -->
                <label
                  class="relative flex items-center justify-center gap-2 bg-[#1A1A1A] border border-[#2F2F2F] rounded-xl p-3 cursor-pointer hover:border-gray-500 transition has-[:checked]:border-[#D4AF37] has-[:checked]:bg-[#D4AF37]/10 group"
                >
                  <input
                    type="radio"
                    name="glass_status"
                    value="Drinking Here"
                    checked
                    class="hidden"
                  />
                  <svg
                    class="w-4 h-4 text-gray-400 group-has-[:checked]:text-[#D4AF37]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  <span
                    class="text-xs font-semibold text-gray-300 group-has-[:checked]:text-white"
                    >Drinking Here</span
                  >
                </label>

                <!-- Option: Take Away -->
                <label
                  class="relative flex items-center justify-center gap-2 bg-[#1A1A1A] border border-[#2F2F2F] rounded-xl p-3 cursor-pointer hover:border-gray-500 transition has-[:checked]:border-amber-500 has-[:checked]:bg-amber-500/10 group"
                >
                  <input
                    type="radio"
                    name="glass_status"
                    value="Take Away"
                    class="hidden"
                  />
                  <svg
                    class="w-4 h-4 text-gray-400 group-has-[:checked]:text-amber-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <span
                    class="text-xs font-semibold text-gray-300 group-has-[:checked]:text-amber-400"
                    >Take Away</span
                  >
                </label>
              </div>
            </div>

            <!-- Fine Amount -->
            <div>
              <label class="block text-xs font-medium text-gray-400 mb-2.5">
                Glass Fine / Deposit
                <span class="text-gray-500 font-normal">(UGX)</span>
              </label>
              <div class="relative">
                <input
                  id="glass_fine"
                  type="number"
                  value="1000"
                  class="w-full bg-[#1A1A1A] border border-[#333333] rounded-xl px-4 py-3 text-sm text-white font-medium focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none transition"
                />
                <span
                  class="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 uppercase font-semibold pointer-events-none"
                >
                  Per Bottle
                </span>
              </div>
            </div>
          </div>
        </div>
    `;
}
