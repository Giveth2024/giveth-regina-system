export function itemRow(itemRow) {
  if (itemRow.unit_type === "Glass") {
    if (itemRow.glass_status === "Take Away") {
      return `
                          <tr class="hover:bg-[#111111]/60 transition-colors group" id=${itemRow.id}>
                    <!-- Product Info & Bottle Status -->
                    <td class="py-4 px-3">
                      <p
                        class="font-semibold text-white group-hover:text-[#D4AF37] transition"
                      >
                        ${itemRow.item_name}
                      </p>
                      <p class="text-xs text-gray-500 mt-0.5">
                        Barcode: ${itemRow.barcode}
                      </p>
    
                      <!-- Bottle Service / Fine Status Badges -->
                      <div
                        class="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]"
                      >
                        <!-- Takeaway + Fine Badge -->
                        <span
                          class="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-md font-medium"
                        >
                          <svg
                            class="w-3 h-3"
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
                          ${itemRow.glass_status} (+UGX ${itemRow.glass_fine_per_unit.toLocaleString()} Bottle Deposit)
                        </span>
    
                        <!-- Alternative Option: Drinking Here (Uncomment when applicable) -->
                        <!-- 
                    <span class="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md font-medium">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                        Drinking Here (No Deposit)
                    </span> 
                    -->
                      </div>
                    </td>
    
                    <!-- Category & Packaging -->
                    <td class="py-4 px-3">
                      <div class="flex items-center gap-1.5">
                        <span
                          class="text-xs bg-[#222222] text-amber-300/80 px-2 py-0.5 rounded border border-[#333333]"
                          >${itemRow.category}</span
                        >
                        <span
                          class="text-xs bg-[#222222] text-amber-400/90 px-2 py-0.5 rounded border border-amber-500/30"
                          >${itemRow.unit_type}</span
                        >
                      </div>
                    </td>
    
                    <!-- Price -->
                    <td class="py-4 px-3 text-right text-gray-300 font-medium">
                      UGX ${itemRow.selling_price.toLocaleString()}
                    </td>
    
                    <!-- Qty -->
                    <td class="py-4 px-3 text-center">
                      <span
                        class="inline-block bg-[#111111] border border-[#333333] font-semibold text-white px-3 py-1 rounded-lg"
                        >${itemRow.full_quantity}</span
                      >
                    </td>
    
                    <!-- Subtotal (Includes bottle deposit if applicable) -->
                    <td class="py-4 px-3 text-right font-bold text-[#D4AF37]">
                      UGX ${(itemRow.subtotal + itemRow.glass_fine_per_unit).toLocaleString()}
                      <span class="block text-[10px] font-normal text-gray-400"
                        >(UGX ${itemRow.subtotal.toLocaleString()} + ${itemRow.glass_fine_per_unit.toLocaleString()} fee)</span
                      >
                    </td>
    
                    <!-- Action -->
                    <td class="py-4 px-3 text-center">
                      <button
                        type="button"
                        id=${itemRow.id}
                        class="deleteRowButton p-2 rounded-lg text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                        title="Remove item"
                      >
                        <svg
                          class="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
            `;
    }

    return `
  <tr class="hover:bg-[#111111]/60 transition-colors group" id="${itemRow.id}">
    <!-- Product Info & On-Site Status -->
    <td class="py-4 px-3">
      <p class="font-semibold text-white group-hover:text-[#D4AF37] transition">
        ${itemRow.item_name}
      </p>
      <p class="text-xs text-gray-500 mt-0.5">
        Barcode: ${itemRow.barcode}
      </p>

      <!-- On-Site Service Status Badge -->
      <div class="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
        <span class="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md font-medium">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          Drinking Here (No Deposit)
        </span>
      </div>
    </td>

    <!-- Category & Packaging -->
    <td class="py-4 px-3">
      <div class="flex items-center gap-1.5">
        <span class="text-xs bg-[#222222] text-amber-300/80 px-2 py-0.5 rounded border border-[#333333]">
          ${itemRow.category}
        </span>
        <span class="text-xs bg-[#222222] text-amber-400/90 px-2 py-0.5 rounded border border-amber-500/30">
          ${itemRow.unit_type}
        </span>
      </div>
    </td>

    <!-- Price -->
    <td class="py-4 px-3 text-right text-gray-300 font-medium">
      UGX ${itemRow.selling_price.toLocaleString()}
    </td>

    <!-- Qty -->
    <td class="py-4 px-3 text-center">
      <span class="inline-block bg-[#111111] border border-[#333333] font-semibold text-white px-3 py-1 rounded-lg">
        ${itemRow.full_quantity}
      </span>
    </td>

    <!-- Subtotal (No added bottle fine) -->
    <td class="py-4 px-3 text-right font-bold text-[#D4AF37]">
      UGX ${itemRow.subtotal.toLocaleString()}
      <span class="block text-[10px] font-normal text-gray-400">
        (Standard Price)
      </span>
    </td>

    <!-- Action -->
    <td class="py-4 px-3 text-center">
      <button
        type="button"
        id="${itemRow.id}"
        class="deleteRowButton p-2 rounded-lg text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer"
        title="Remove item"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </td>
  </tr>
`;
  }
  return `
                  <tr class="hover:bg-[#111111]/60 transition-colors group" id="${itemRow.id}">
                <td class="py-4 px-3">
                  <p
                    class="font-semibold text-white group-hover:text-[#D4AF37] transition"
                  >
                    ${itemRow.item_name}
                  </p>
                  <p class="text-xs text-gray-500 mt-0.5">
                    Barcode: ${itemRow.barcode}
                  </p>
                </td>
                <td class="py-4 px-3">
                  <div class="flex items-center gap-1.5">
                    <span
                      class="text-xs bg-[#222222] text-gray-300 px-2 py-0.5 rounded border border-[#333333]"
                      >${itemRow.category}</span
                    >
                    <span
                      class="text-xs bg-[#222222] text-gray-400 px-2 py-0.5 rounded border border-[#333333]"
                      >${itemRow.unit_type}</span
                    >
                  </div>
                </td>
                <td class="py-4 px-3 text-right text-gray-300 font-medium">
                  UGX ${itemRow.selling_price.toLocaleString()}
                </td>
                <td class="py-4 px-3 text-center">
                  <span
                    class="inline-block bg-[#111111] border border-[#333333] font-semibold text-white px-3 py-1 rounded-lg"
                    >${itemRow.full_quantity}</span
                  >
                </td>
                <td class="py-4 px-3 text-right font-bold text-[#D4AF37]">
                  UGX ${itemRow.subtotal.toLocaleString()}
                </td>
                <td class="py-4 px-3 text-center">
                  <button
                    type="button"
                    id=${itemRow.id}
                    class="deleteRowButton p-2 rounded-lg text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                    title="Remove item"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
    `;
}
