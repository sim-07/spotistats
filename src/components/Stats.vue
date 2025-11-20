<template>
    <div class="flex items-center gap-5">
        <select v-model="time" class="p-2 rounded text-white">
            <option :value="30">1 month</option>
            <option :value="180">6 months</option>
            <option :value="currentYearDays">{{ new Date().getFullYear() }}</option>
            <option :value="365">1 year</option>
            <option :value="0">All</option>
        </select>
        <i class="pi pi-pencil cursor-pointer" style="font-size: 0.9rem" @click="customDateDialog = false"></i>

    </div>

    <div class="mt-16 mb-10 flex gap-15">
        <h1 class="mt-7 mb-7 font-bold text-2xl">Total listened (minutes):</h1>
        <h1 class="text-4xl font-semibold mt-5 mb-15">

            {{ totalListenedMinutes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
 }}
        </h1>
    </div>

    <div class="mt-6 bg-[#2d2d2d] p-5 rounded-md space-y-4 ">


        <h2 class="text-lg font-semibold">
            Unique artists:
            <span class="text-2xl font-bold ml-2">{{ props.topArtists.length }}</span> artists
        </h2>

        <h2 class="text-lg font-semibold">
            Unique songs:
            <span class="text-2xl font-bold ml-2">{{ props.topSongs.length }}</span> songs
        </h2>

        <h2 class="text-lg font-semibold">
            Average song duration:
            <span class="text-2xl font-bold ml-2">{{ avgSongDuration }}</span> min
        </h2>
    </div>

    <h2 class="text-2xl mb-4 mt-20">Top artists</h2>
    <div class="mt-8 h-[715px] overflow-y-auto bg-[#2d2d2d] p-5 rounded-md min-w-[370px]">
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
                    <tr v-for="(item, idx) in displayedArtists" :key="item.artist" class="bg-[#222] rounded">
                        <td class="px-4 py-3 align-top">{{ idx + 1 }}</td>
                        <td class="px-4 py-3 align-top">{{ item.artist }}</td>
                        <td class="px-4 py-3 align-top">{{ item.minutes > 0 ? item.minutes : '<1' }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div v-if="props.topArtists.length > 10" class="mt-4">
        <button @click="showAllArtists = !showAllArtists"
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white font-medium shadow-md transition">
            {{ showAllArtists ? 'Show less' : 'View all' }}
        </button>
    </div>


    <h2 class="text-2xl mb-4 mt-20">Top songs</h2>
    <div class="mt-8 h-[715px] overflow-y-auto bg-[#2d2d2d] p-5 rounded-md">

        <div class="overflow-auto">
            <table class="table-fixed w-full border-separate border-spacing-y-3">
                <thead>
                    <tr class="text-left text-gray-300">
                        <th class="px-4 py-3 w-12">#</th>
                        <th class="px-4 py-3">Songs</th>
                        <th class="px-4 py-3">Artist</th>
                        <th class="px-4 py-3 w-48">Minutes listened</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, idx) in displayedSongs" :key="item.song" class="bg-[#222] rounded">
                        <td class="px-4 py-3 align-top">{{ idx + 1 }}</td>
                        <td class="px-4 py-3 align-top wrap-break-word">{{ item.song }}</td>
                        <td class="px-4 py-3 align-top wrap-break-word">{{ item.artist }}</td>
                        <td class="px-4 py-3 align-top">{{ item.minutes > 0 ? item.minutes : '<1' }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

    </div>
    <div v-if="props.topSongs.length > 10" class="mt-4">
        <button @click="showAllSongs = !showAllSongs"
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white font-medium shadow-md transition">
            {{ showAllSongs ? 'Show less' : 'View all' }}
        </button>
    </div>

    <div class="mt-10 bg-[#2d2d2d] p-5 rounded-md">
        <!--CHART-->
        <div class="mt-16 chart-wrapper mb-10">
            <LineChart :data="chartData" :options="chartOptions" />
        </div>

        <!--CALENDAR-->
        <div class="mt-16">
            <div class="flex flex-col md:flex-row gap-4 w-full">
                <div class="flex-1 min-w-0">
                    <VDatePicker v-model="selectedDay" mode="date" class="w-full" />
                </div>

                <div class="flex-1 min-w-0 bg-gray-800 text-white p-4 rounded-lg w-full">
                    <h2>{{ selectedDay.toLocaleDateString('en-GB') }}</h2>
                    <div class="mt-3 h-[600px] overflow-y-auto">
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

</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler, type ChartData, type ChartOptions } from 'chart.js'
import 'primeicons/primeicons.css'

const LineChart = Line

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

const props = defineProps<{
    time: number
    selectedDay: Date
    currentYearDays: number
    totalListenedMinutes: number
    avgSongDuration: number
    topArtists: { artist: string; minutes: number }[]
    topSongs: { song: string; artist: string; minutes: number }[]
    listeningPerDay: Map<string, number>
    listeningPerDayPerArtist: Map<string, Map<string, number>>
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
const customDateDialog = ref(false)

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
