<template>
    <div class="flex flex-col min-h-screen bg-[#1a1a1a] text-white antialiased">

        <header class="bg-[#1a1a1a]">
            <div class="max-w-7xl mx-auto px-6 lg:px-8">
                <nav class="flex items-center justify-between h-16 relative">
                    <div class="flex items-center gap-3">
                        <div
                            class="w-9 h-9 rounded-lg flex items-center justify-center bg-emerald-500 text-white shadow-sm">
                            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                                    stroke-width="1.5" />
                            </svg>
                        </div>
                        <span class="text-lg font-semibold tracking-tight text-white">Spotify Stats</span>
                    </div>

                    <div class="items-center gap-6 text-sm text-white">
                        <a href="https://www.spotify.com/us/account/privacy/" target="_blank"
                            class="hover:text-emerald-400">How to get history</a>
                    </div>

                </nav>
            </div>
        </header>



        <main class="flex-1">
            <section class="max-w-7xl mx-auto px-6 lg:px-8 py-20">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div class="lg:col-span-6">
                        <h1 class="text-4xl sm:text-5xl leading-tight font-extrabold text-gray-300 mb-6">
                            Explore your Spotify listening history
                        </h1>

                        <p class="text-base text-gray-400 max-w-xl mb-8">
                            Upload all the folder "Spotify Extended Streaming History" already extracted (NOT zip) — it
                            will be processed locally in your browser.
                        </p>

                        <div class="flex items-start">
                            <label
                                class="relative inline-flex items-center justify-center px-6 py-3 rounded-lg bg-emerald-600 text-white font-semibold shadow-lg hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-400 cursor-pointer transition transform hover:-translate-y-0.5"
                                role="button" aria-label="Upload Spotify history">
                                <input @change="handleFolder" type="file" webkitdirectory directory multiple
                                    class="sr-only" />
                                <span class="flex items-center gap-3">
                                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 3v12" stroke="currentColor" stroke-width="1.6"
                                            stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M8 7l4-4 4 4" stroke="currentColor" stroke-width="1.6"
                                            stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M20 21H4" stroke="currentColor" stroke-width="1.6"
                                            stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    Upload history
                                </span>
                            </label>


                        </div>

                        <p class="text-xs text-gray-500 mt-3">
                            We process the file in your browser — nothing is uploaded to any server.
                        </p>
                    </div>

                    <div class="lg:col-span-6 hidden lg:flex justify-center">
                        <div class="w-full max-w-md">
                            <div class="rounded-2xl p-6 bg-gradient-to-br from-white to-gray-50 shadow-md">
                                <div class="flex items-center gap-4 mb-4">
                                    <div
                                        class="w-16 h-16 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow">
                                        <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 3v12" stroke="currentColor" stroke-width="1.6"
                                                stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M8 7l4-4 4 4" stroke="currentColor" stroke-width="1.6"
                                                stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div class="text-sm font-semibold text-gray-800">Listening summary</div>
                                        <div class="text-xs text-gray-500">Sample preview</div>
                                    </div>
                                </div>

                                <div class="grid grid-cols-3 gap-3 text-center">
                                    <div>
                                        <div class="text-lg font-bold text-gray-900">256</div>
                                        <div class="text-xs text-gray-500">Tracks</div>
                                    </div>
                                    <div>
                                        <div class="text-lg font-bold text-gray-900">7,892</div>
                                        <div class="text-xs text-gray-500">Minutes</div>
                                    </div>
                                    <div>
                                        <div class="text-lg font-bold text-gray-900">128</div>
                                        <div class="text-xs text-gray-500">Artists</div>
                                    </div>
                                </div>

                                <div class="mt-5">
                                    <div class="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                                        <div class="h-full bg-emerald-500" style="width:62%"></div>
                                    </div>
                                    <div class="text-xs text-gray-500 mt-2">Listening progress</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <div v-if="showStats" class="mt-4 p-4 bg-emerald-500 text-white">
            <select v-model="time" class="mb-2 p-1 rounded text-black">
                <option :value="30">1 month</option>
                <option :value="180">6 months</option>
                <option :value="365">1 year</option>
                <option :value="0">All</option>
            </select>

            <h1>Total listened: {{ totalListenedMinutes }}</h1>
        </div>


        <footer class="mt-auto py-8 text-center text-sm text-gray-500">
            © 2025 Spotify Stats
        </footer>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface historyProps {
    ts: string;
    ms_played: number;
    master_metadata_track_name: string;
    master_metadata_album_artist_name: string;
}

const showStats = ref(false)
const time = ref(30)
const totalListenedMinutes = ref(0)
let allData: historyProps[][] = []

async function handleFolder(event: Event) {
    const files = (event.target as HTMLInputElement).files
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)
    const jsonFiles = fileArray.filter(f => f.name.endsWith('.json'))

    const dataArray = await Promise.all(
        jsonFiles.map(file =>
            new Promise<historyProps[]>((resolve) => {
                const reader = new FileReader()
                reader.onload = () => {
                    try {
                        const data = JSON.parse(reader.result as string)
                        resolve(data)
                    } catch {
                        console.warn(file.name + ' is not valid JSON')
                        resolve([])
                    }
                }
                reader.readAsText(file)
            })
        )
    )

    allData = dataArray
    showStats.value = true
    calculateStats()
}

watch(time, () => {
    calculateStats()
})

function calculateStats() {
    let totalListened = 0
    const now = new Date().getTime()
    const cutoff = time.value > 0 ? now - time.value * 24 * 60 * 60 * 1000 : 0

    allData.forEach(fileData => {
        fileData.forEach(track => {
            const trackTime = new Date(track.ts).getTime()
            if (cutoff === 0 || trackTime >= cutoff) {
                totalListened += track.ms_played
            }
        })
    })

    totalListenedMinutes.value = Math.floor(totalListened / 1000 / 60)
}

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity .12s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>