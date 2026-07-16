<template>
    <div class="flex flex-col items-center justify-center text-center">
        <h2 class="text-2xl sm:text-3xl leading-tight font-extrabold text-gray-200 mb-4">
            Explore your YouTube Music listening history
        </h2>

        <p class="text-sm text-gray-400 max-w-md mb-6">
            Upload your watch-history.json file (from Takeout) — it will be processed locally in your browser.
        </p>

        <div class="flex items-center justify-center">
            <label
                class="relative inline-flex items-center justify-center px-6 py-3 rounded-lg bg-red-600 text-white font-semibold shadow-lg hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-400 cursor-pointer transition transform hover:-translate-y-0.5"
                role="button" aria-label="Upload YouTube Music history">
                <input @change="handleFolder" type="file" accept=".json" class="sr-only" />
                <span class="flex items-center gap-3">
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <path d="M12 3v12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M8 7l4-4 4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M20 21H4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    Upload YT Music JSON
                </span>
            </label>
        </div>

        <p class="text-xs text-gray-500 mt-4">
            No files are uploaded to any server.
        </p>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    handleFolder: (e: Event) => void;
}>()
</script>