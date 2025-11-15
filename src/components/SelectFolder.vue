<template>
    <div style="width: 100vw; height: 100vh; position: absolute; top: 0; left: 0; background-color: black;">
        <DarkVeil
            :hue-shift="0"
            :noise-intensity="0"
            :scanline-intensity="0"
            :speed="1.0"
            :scanline-frequency="0"
            :warp-amount="0"
            :resolution-scale="1"
        />
    </div>
    
    <div class="absolute inset-0 z-[50] flex flex-col items-center justify-center text-center px-6">
        <h1 class="text-4xl sm:text-5xl leading-tight font-extrabold text-gray-300 mb-6">
            Explore your Spotify listening history
        </h1>

        <p class="text-base text-gray-400 max-w-xl mb-8">
            Upload the folder "Spotify Extended Streaming History" already extracted (NOT zip) — it will
            be processed locally in your browser.
        </p>

        <div class="flex items-start">
            <label
                class="relative inline-flex items-center justify-center px-6 py-3 rounded-lg bg-emerald-600 text-white font-semibold shadow-lg hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-400 cursor-pointer transition transform hover:-translate-y-0.5"
                role="button" aria-label="Upload Spotify history">
                <input @change="handleFolder" type="file" webkitdirectory directory multiple class="sr-only" />
                <span class="flex items-center gap-3">
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <path d="M12 3v12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"
                            stroke-linejoin="round" />
                        <path d="M8 7l4-4 4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"
                            stroke-linejoin="round" />
                        <path d="M20 21H4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                    Upload history
                </span>
            </label>
        </div>

        <p class="text-xs text-gray-500 mt-3">
            We process the file in your browser — nothing is uploaded to any server.
        </p>
    </div>
</template>


<script setup lang="ts">
import DarkVeil from '../DesignComponent/DarkVeil.vue'

defineProps<{
    handleFolder: (e: Event) => void;
}>()
</script>