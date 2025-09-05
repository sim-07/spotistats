<template>
    <div class="flex flex-col min-h-screen bg-[#1a1a1a] text-white antialiased">
        <header class="bg-[#1a1a1a]">
            <div class="max-w-7xl mx-auto px-6 lg:px-8">
                <nav class="flex items-center justify-between h-16 relative mt-3">
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

        <main class="flex flex-1 flex-col justify-center">
            <section class="mx-auto px-6 py-20 max-w-5xl">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    <div v-if="!showStats" class="lg:col-span-12">
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

                    <!-- replace the current stats container -->
                    <div v-if="showStats" class="lg:col-span-12 mt-4 p-6 text-white">
                        <div class="flex items-center gap-4">
                            <select v-model="time" class="p-2 rounded text-black">
                                <option :value="30">1 month</option>
                                <option :value="180">6 months</option>
                                <option :value="365">1 year</option>
                                <option :value="0">All</option>
                            </select>

                            <h1 class="text-lg font-semibold ml-4">Total listened:
                                <span class="text-2xl font-bold ml-2">{{ totalListenedMinutes }}</span> minutes
                            </h1>
                        </div>

                        <div class="mt-8">
                            <h2 class="text-2xl mb-4">Top artists</h2>

                            <!-- TABLE -->
                            <div class="overflow-auto">
                                <table class="table-fixed w-full border-separate border-spacing-y-3">
                                    <thead>
                                        <tr class="text-left text-gray-300">
                                            <th class="px-4 py-3 w-12">#</th>
                                            <th class="px-4 py-3">Artist</th>
                                            <th class="px-4 py-3 w-48">Minutes listened</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item, idx) in displayedArtists" :key="item.artist"
                                            class="bg-[#222] rounded">
                                            <td class="px-4 py-3 align-top">{{ idx + 1 }}</td>
                                            <td class="px-4 py-3 align-top break-words">{{ item.artist }}</td>
                                            <td class="px-4 py-3 align-top">{{ item.minutes > 0 ? item.minutes : '<1'
                                                    }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div v-if="topArtists.length > 10" class="mt-4">
                                <button @click="showAll = !showAll"
                                    class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white font-medium shadow-md transition">
                                    {{ showAll ? 'Show less' : 'View all' }}
                                </button>
                            </div>
                        </div>

                        <!-- CHART -->
                        <div class="mt-8 chart-wrapper mb-10">
                            <LineChart :data="chartData" :options="chartOptions" />
                        </div>

                        <div class="mt-8">
                            <div class="flex flex-col md:flex-row gap-4 w-full">
                                <div class="flex-1 min-w-0">
                                    <VDatePicker v-model="selectedDay" mode="date" class="w-full" />
                                </div>

                                <div class="flex-1 min-w-0 bg-gray-800 text-white p-4 rounded-lg w-full">
                                    <h2>{{ selectedDay.toLocaleDateString('en-GB') }}</h2>
                                    <table class="table-fixed w-full border-separate border-spacing-y-2 mt-3">
                                        <thead>
                                            <tr class="text-left text-gray-300">
                                                <th class="px-3 py-2">Artist</th>
                                                <th class="px-3 py-2">Minutes listened</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="([artist, minutes]) in Array.from(listeningPerDayPerArtist.get(selectedDay.toISOString().slice(0, 10)) || [])"
                                                :key="artist" class="bg-[#222] rounded">
                                                <td class="px-3 py-2 align-top">{{ artist }}</td>
                                                <td class="px-3 py-2 align-top">{{ Math.floor(minutes) > 0 ?
                                                    Math.floor(minutes) : '<1' }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </main>

        <footer class="mt-auto py-8 text-center text-sm text-gray-500">
            © 2025 Spotify Stats
        </footer>
    </div>
</template>

<style scoped>
@media (min-width: 768px) {
    .force-md-row {
        flex-direction: row !important;
    }
}

.force-md-row>* {
    min-width: 0;
}
</style>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler } from 'chart.js'
import type { ChartData, ChartOptions } from 'chart.js'

interface historyProps {
    ts: string
    ms_played: number
    master_metadata_track_name: string
    master_metadata_album_artist_name: string
}

const showStats = ref(false)
const time = ref(30)
let allData: historyProps[][] = []
const totalListenedMinutes = ref(0)
const topArtists = ref<{ artist: string; minutes: number }[]>([])
const listeningPerDay = ref(new Map<string, number>())
const listeningPerDayPerArtist = ref(new Map<string, Map<string, number>>())
const showAll = ref(false)
const selectedDay = ref(new Date())
let lastDate: number;


const displayedArtists = computed(() => (showAll.value ? topArtists.value : topArtists.value.slice(0, 10)))

async function handleFolder(event: Event) {
    const files = (event.target as HTMLInputElement).files
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)
    const jsonFiles = fileArray.filter((f) => f.name.endsWith('.json'))

    const dataArray = await Promise.all(
        jsonFiles.map(
            (file) =>
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
    const lastDay = allData[allData.length - 1]
    const lastTrack = lastDay[lastDay.length - 1]
    lastDate = new Date(lastTrack.ts).getTime();
    showStats.value = true
    calculateStats()
    calculateTopArtists()
    calcGraphData()
    calcCalendarData()
}

watch(time, () => {
    calculateStats()
    calculateTopArtists()
    calcGraphData()
    calcCalendarData()
})

watch(listeningPerDayPerArtist, () => {
    console.log(listeningPerDayPerArtist)
})

function calculateStats() {
    let totalListened = 0
    const cutoff = time.value > 0 ? lastDate - time.value * 24 * 60 * 60 * 1000 : 0

    allData.forEach((fileData) => {
        fileData.forEach((track) => {
            const trackTime = new Date(track.ts).getTime()
            if (cutoff === 0 || trackTime >= cutoff) {
                totalListened += track.ms_played
            }
        })
    })

    totalListenedMinutes.value = Math.floor(totalListened / 1000 / 60)
}

function calculateTopArtists() {
    const artistMap = new Map<string, number>()
    const cutoff = time.value > 0 ? lastDate - time.value * 24 * 60 * 60 * 1000 : 0

    allData.forEach((fileData) => {
        fileData.forEach((track) => {
            const trackTime = new Date(track.ts).getTime()
            if (cutoff === 0 || trackTime >= cutoff) {
                if (!track.master_metadata_album_artist_name || !track.ms_played) return

                const prev = artistMap.get(track.master_metadata_album_artist_name) || 0
                artistMap.set(track.master_metadata_album_artist_name, prev + track.ms_played)
            }
        })
    })

    const sorted = Array.from(artistMap.entries())
        .map(([artist, ms]) => ({
            artist,
            minutes: Math.floor(ms / 1000 / 60),
        }))
        .sort((a, b) => b.minutes - a.minutes)

    topArtists.value = sorted
}

function calcGraphData() {
    const cutoff = time.value > 0 ? lastDate - time.value * 24 * 60 * 60 * 1000 : 0
    const tempMap = new Map<string, number>()

    allData.forEach((fileData) => {
        fileData.forEach((track) => {
            const trackTime = new Date(track.ts).getTime()
            if (cutoff === 0 || trackTime >= cutoff) {
                const day = new Date(track.ts).toISOString().slice(0, 10)
                const prev = tempMap.get(day) || 0
                tempMap.set(day, prev + track.ms_played)
            }
        })
    })

    const finalMap = new Map<string, number>()
    tempMap.forEach((ms, day) => finalMap.set(day, Math.floor(ms / 1000 / 60)))
    listeningPerDay.value = finalMap

}

function calcCalendarData() {
    const tempMapPerDay = new Map<string, Map<string, number>>()

    allData.forEach((fileData) => {
        fileData.forEach((track) => {
            const day = new Date(track.ts).toISOString().slice(0, 10)
            const artist = track.master_metadata_album_artist_name || 'Unknown'
            const minutes = (track.ms_played || 0) / 1000 / 60

            let artistMap = tempMapPerDay.get(day)
            if (!artistMap) {
                artistMap = new Map<string, number>()
                tempMapPerDay.set(day, artistMap)
            }

            const prevMinutes = artistMap.get(artist) || 0
            artistMap.set(artist, prevMinutes + minutes)
        })
    })

    const sortedPerDay = new Map<string, Map<string, number>>()
    tempMapPerDay.forEach((artistMap, day) => {
        const sortedArtists = Array.from(artistMap.entries())
            .sort((a, b) => b[1] - a[1])
        sortedPerDay.set(day, new Map(sortedArtists))
    })

    const daysWithTotals: Array<[string, number]> = []
    sortedPerDay.forEach((artistMap, day) => {
        const total = Array.from(artistMap.values()).reduce((s, v) => s + v, 0)
        daysWithTotals.push([day, total])
    })

    daysWithTotals.sort((a, b) => b[1] - a[1])

    const finalOrdered = new Map<string, Map<string, number>>()
    for (const [day] of daysWithTotals) {
        finalOrdered.set(day, sortedPerDay.get(day)!)
    }

    listeningPerDayPerArtist.value = finalOrdered
}


ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler)
const LineChart = Line

const chartData = computed<ChartData<'line', number[], string>>(() => {
    const sortedDays = Array.from(listeningPerDay.value.keys()).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    const data = sortedDays.map((day) => listeningPerDay.value.get(day) || 0)
    const labels = sortedDays.map((d) => {
        const dt = new Date(d)
        const dd = dt.getDate().toString().padStart(2, '0')
        const mm = (dt.getMonth() + 1).toString().padStart(2, '0')
        return `${dd}/${mm}/${dt.getFullYear()}`
    })

    return {
        labels,
        datasets: [
            {
                label: 'Minutes listened',
                data,
                borderColor: '#34d399',
                backgroundColor: 'rgba(52, 211, 153, 0.18)',
                fill: true,
                tension: 0.3,
                pointRadius: 2,
            },
        ],
    }
})

const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: { mode: 'index', intersect: false },
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: { stepSize: 10 },
        },
        x: {
            ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 12 },
        },
    },
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

.chart-wrapper {
    height: 240px;
}
</style>