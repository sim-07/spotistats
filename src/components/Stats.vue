<template>
    <div class="flex flex-col gap-1.5 w-full sm:w-48 shrink-0 px-2 sm:px-0">
        <label class="text-xs text-gray-400 whitespace-nowrap">Timeframe calculated from last track</label>
        <select v-model="time"
            class="py-2 px-3 pr-8 rounded bg-[#2a2a2a] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 text-sm w-full cursor-pointer h-10">
            <option :value="30" class="bg-[#2a2a2a]">1 month</option>
            <option :value="180" class="bg-[#2a2a2a]">6 months</option>
            <option :value="currentYearDays" class="bg-[#2a2a2a]">{{ dataYear }}</option>
            <option :value="365" class="bg-[#2a2a2a]">1 year</option>
            <option :value="0" class="bg-[#2a2a2a]">All</option>
        </select>
    </div>

    <div class="mt-8 mb-6 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 px-2 sm:px-0">
        <h1 class="font-bold text-xl sm:text-2xl text-gray-200">
            {{ props.service === "spotify" ? "Total listened (minutes):" : "Total listened (estimated minutes):" }}
        </h1>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-white">
            {{ totalListenedMinutes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") }}
        </h1>
    </div>

    <div class="mt-6 bg-[#2d2d2d] px-2 py-3 sm:p-5 rounded-lg space-y-3 sm:space-y-4">
        <h2 class="text-base sm:text-lg font-semibold">
            Unique artists:
            <span class="text-xl sm:text-2xl font-bold ml-1 sm:ml-2 text-emerald-400">{{ props.topArtists.length
                }}</span> artists
        </h2>

        <h2 class="text-base sm:text-lg font-semibold">
            Unique songs:
            <span class="text-xl sm:text-2xl font-bold ml-1 sm:ml-2 text-emerald-400">{{ props.topSongs.length }}</span>
            songs
        </h2>

        <h2 v-if="props.service === 'spotify'" class="text-base sm:text-lg font-semibold">
            Average song duration:
            <span class="text-xl sm:text-2xl font-bold ml-1 sm:ml-2 text-emerald-400">{{ avgSongDuration }}</span> min
        </h2>
    </div>

    <h2 class="text-xl sm:text-2xl mb-4 mt-12 sm:mt-20 font-bold px-2 sm:px-0">Top artists</h2>
    <div class="mt-4 bg-[#2d2d2d] px-2 py-3 sm:p-5 rounded-lg">
        <div class="overflow-x-auto max-h-[450px] sm:max-h-[600px] overflow-y-auto">
            <table class="w-full border-separate border-spacing-y-2 text-sm sm:text-base table-fixed">
                <thead>
                    <tr class="text-left text-gray-400 text-xs sm:text-sm">
                        <th class="px-2 sm:px-4 py-2 w-[12%] sm:w-[10%]">#</th>
                        <th class="px-2 sm:px-4 py-2 w-[63%] sm:w-[70%]">Artist</th>
                        <th class="px-2 sm:px-4 py-2 text-right w-[25%] sm:w-[20%]">
                            {{ props.service === "spotify" ? "Minutes" : "Plays" }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, idx) in displayedArtists" :key="item.artist" class="bg-[#222] rounded">
                        <td class="px-2 sm:px-4 py-2.5 font-medium text-gray-400">{{ idx + 1 }}</td>
                        <td class="px-2 sm:px-4 py-2.5 font-semibold truncate">{{ item.artist }}</td>
                        <td class="px-2 sm:px-4 py-2.5 font-mono text-emerald-400 text-right truncate">
                            {{ item.val > 0 ? item.val : '<1' }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div v-if="props.topArtists.length > 10" class="mt-3 px-2 sm:px-0">
        <button @click="showAllArtists = !showAllArtists"
            class="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white font-medium shadow-md transition text-sm">
            {{ showAllArtists ? 'Show less' : 'View all' }}
        </button>
    </div>

    <h2 class="text-xl sm:text-2xl mb-4 mt-12 sm:mt-20 font-bold px-2 sm:px-0">Top songs</h2>
    <div class="mt-4 bg-[#2d2d2d] px-2 py-3 sm:p-5 rounded-lg">
        <div class="overflow-x-auto max-h-[450px] sm:max-h-[600px] overflow-y-auto">
            <table class="w-full border-separate border-spacing-y-2 text-sm sm:text-base table-fixed">
                <thead>
                    <tr class="text-left text-gray-400 text-xs sm:text-sm">
                        <th class="px-2 sm:px-4 py-2 w-[10%] sm:w-[8%]">#</th>
                        <th class="px-2 sm:px-4 py-2 w-[45%] sm:w-[42%]">Song</th>
                        <th class="px-2 sm:px-4 py-2 w-[25%] sm:w-[32%]">Artist</th>
                        <th class="px-2 sm:px-4 py-2 text-right w-[20%] sm:w-[18%]">
                            {{ props.service === "spotify" ? "Minutes" : "Plays" }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, idx) in displayedSongs" :key="item.song" class="bg-[#222] rounded">
                        <td class="px-2 sm:px-4 py-2.5 font-medium text-gray-400">{{ idx + 1 }}</td>
                        <td class="px-2 sm:px-4 py-2.5 font-semibold truncate">{{ item.song }}</td>
                        <td class="px-2 sm:px-4 py-2.5 text-gray-300 truncate">{{ item.artist }}</td>
                        <td class="px-2 sm:px-4 py-2.5 font-mono text-emerald-400 text-right truncate">
                            {{ item.val > 0 ? item.val : '<1' }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div v-if="props.topSongs.length > 10" class="mt-3 px-2 sm:px-0">
        <button @click="showAllSongs = !showAllSongs"
            class="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white font-medium shadow-md transition text-sm">
            {{ showAllSongs ? 'Show less' : 'View all' }}
        </button>
    </div>

    <div class="mt-10 bg-[#2d2d2d] px-2 py-3 sm:p-5 rounded-lg">
        <div class="mt-4 sm:mt-8 h-[250px] sm:h-[350px] chart-wrapper mb-10">
            <LineChart :data="chartData" :options="chartOptions" />
        </div>

        <div class="mt-8 sm:mt-16">
            <div class="flex flex-col lg:flex-row gap-6 w-full lg:items-stretch">
                
                <div class="w-full lg:flex-1 min-w-0 p-6 rounded-lg flex items-center justify-center overflow-hidden">
                    <VDatePicker 
                        v-model="selectedDay" 
                        mode="date" 
                        class="w-full max-w-[360px] transform scale-105 sm:scale-110 origin-center" 
                        borderless 
                    />
                </div>

                <div class="w-full lg:flex-1 min-w-0 bg-gray-800 text-white px-3 py-4 sm:p-5 rounded-lg flex flex-col justify-between lg:h-auto">
                    <div>
                        <h2 class="font-bold border-b border-gray-700 pb-2 text-base sm:text-lg">
                            {{ selectedDay.toLocaleDateString('en-GB') }}
                        </h2>
                        <div class="mt-3 pr-1">
                            <!-- Altezza massima aumentata a 350px per allinearsi al calendario ingrandito -->
                            <div class="overflow-x-auto max-h-[280px] lg:max-h-[350px] overflow-y-auto">
                                <table class="w-full border-separate border-spacing-y-2 text-xs sm:text-sm table-fixed">
                                    <thead>
                                        <tr class="text-left text-gray-400">
                                            <th class="px-2 py-1 w-[70%]">Artist</th>
                                            <th class="px-2 py-1 text-right w-[30%]">
                                                {{ props.service === "spotify" ? "Minutes" : "Plays" }}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="([artist, minutes]) in Array.from(listeningPerDayPerArtist.get(selectedDay.toISOString().slice(0, 10)) || [])"
                                            :key="artist" class="bg-[#222] rounded">
                                            <td class="px-3 py-2 font-semibold truncate">{{ artist }}</td>
                                            <td class="px-3 py-2 font-mono text-emerald-400 text-right truncate">
                                                {{ Math.floor(minutes) > 0 ? Math.floor(minutes) : '<1' }}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler, type ChartData, type ChartOptions } from 'chart.js'
import 'primeicons/primeicons.css'
//import Dialog from './Dialog.vue'

const LineChart = Line

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

const props = defineProps<{
    time: number
    selectedDay: Date
    currentYearDays: number
    dataYear: number
    totalListenedMinutes: number
    avgSongDuration: number
    topArtists: { artist: string; val: number; }[]
    topSongs: { song: string; artist: string; val: number }[]
    listeningPerDay: Map<string, number>
    listeningPerDayPerArtist: Map<string, Map<string, number>>
    service: string
}>()


ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler)

const chartData = computed<ChartData<'line', number[], string>>(() => {
    const sortedDays = Array.from(props.listeningPerDay.keys()).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    const data = sortedDays.map((day) => props.listeningPerDay.get(day) || 0)
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


const showAllArtists = ref(false)
const showAllSongs = ref(false)
//const customDateDialog = ref(false)

const displayedArtists = computed(() =>
    showAllArtists.value ? props.topArtists : props.topArtists.slice(0, 10)
)

const displayedSongs = computed(() =>
    showAllSongs.value ? props.topSongs : props.topSongs.slice(0, 10)
)

const emit = defineEmits<{
    (e: 'update:time', value: number): void
    (e: 'update:selectedDay', value: Date): void
}>()

const time = computed({
    get: () => props.time,
    set: (val: number) => emit('update:time', val)
})

const selectedDay = computed({
    get: () => props.selectedDay,
    set: (val: Date) => emit('update:selectedDay', val)
})
</script>
