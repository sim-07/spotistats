<template>
    <div class="flex flex-col min-h-screen bg-[#1a1a1a] text-white antialiased">
        <Header></Header>

        <main class="flex flex-1 flex-col justify-center">
            <section class="mx-auto px-6 py-20 max-w-5xl">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    <div v-if="!showStats">
                        <SelectFolder :handleFolder="handleFolder" />
                    </div>

                    <div v-if="showStats" class="lg:col-span-12 mt-4 p-6 text-white mb-10">
                        <Stats v-model:time="time" v-model:selectedDay="selectedDay"
                            :totalListenedMinutes="totalListenedMinutes" :avgSongDuration="avgSongDuration"
                            :topArtists="topArtists" :topSongs="topSongs"
                            :listeningPerDayPerArtist="listeningPerDayPerArtist" :listeningPerDay="listeningPerDay"
                            :currentYearDays="currentYearDays" />
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
import { ref, watch } from 'vue'
import SelectFolder from '../components/SelectFolder.vue'
import Stats from '../components/Stats.vue'
import Header from '../components/Header.vue'

interface historyProps {
    ts: string
    ms_played: number
    master_metadata_track_name: string
    master_metadata_album_artist_name: string
}

const showStats = ref(false)
const time = ref(30)
let allData: historyProps[] = []
const totalListenedMinutes = ref(0)
const topArtists = ref<{ artist: string; minutes: number }[]>([])
const topSongs = ref<{ song: string; artist: string; minutes: number }[]>([])
const listeningPerDay = ref(new Map<string, number>())
const listeningPerDayPerArtist = ref(new Map<string, Map<string, number>>())

const selectedDay = ref(new Date())
let lastDate: number;
const startOfYear = new Date(new Date().getFullYear(), 0, 1)
let currentYearDays: number; // Lo calcolo dall'ultima traccia registrata, non da oggi
let avgSongDuration: number;



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

    allData = dataArray.flat().sort((a, b) => {
        return new Date(a.ts).getTime() - new Date(b.ts).getTime()
    })
    const lastTrack = allData[allData.length - 1]

    lastDate = new Date(lastTrack.ts).getTime();
    currentYearDays = Math.floor((lastDate - startOfYear.getTime()) / (1000 * 60 * 60 * 24))

    selectedDay.value = new Date(lastTrack.ts);
    showStats.value = true
    calculateTopSongs()
    calculateStats()
    calculateTopArtists()
    calcGraphData()
    calcCalendarData()
}

watch(time, () => {
    calculateTopArtists()
    calculateTopSongs()
    calculateStats()
    calcGraphData()
    calcCalendarData()
})

function calculateStats() {
    let totalListened = 0
    const cutoff = time.value > 0 ? lastDate - time.value * 24 * 60 * 60 * 1000 : 0
    let tracks = 0;

    allData.forEach((track) => {
        const trackTime = new Date(track.ts).getTime()
        if (cutoff === 0 || trackTime >= cutoff) {
            totalListened += track.ms_played
            tracks++;
        }
    })

    totalListenedMinutes.value = Math.floor(totalListened / 1000 / 60)
    avgSongDuration = Number(((totalListened / 1000 / 60) / tracks).toFixed(2))
}

function calculateTopArtists() {
    const artistMap = new Map<string, number>()
    const cutoff = time.value > 0 ? lastDate - time.value * 24 * 60 * 60 * 1000 : 0

    allData.forEach((track) => {
        const trackTime = new Date(track.ts).getTime()
        if (cutoff === 0 || trackTime >= cutoff) {
            if (!track.master_metadata_album_artist_name || !track.ms_played) return

            const prev = artistMap.get(track.master_metadata_album_artist_name) || 0
            artistMap.set(track.master_metadata_album_artist_name, prev + track.ms_played)
        }
    })

    const sorted = Array.from(artistMap.entries())
        .map(([artist, ms]) => ({
            artist,
            minutes: Math.floor(ms / 1000 / 60),
        }))
        .sort((a, b) => b.minutes - a.minutes)

    topArtists.value = sorted
}

function calculateTopSongs() {
    const songMap = new Map<string, { artist: string, ms: number }>()
    const cutoff = time.value > 0 ? lastDate - time.value * 24 * 60 * 60 * 1000 : 0

    allData.forEach((track) => {
        const trackTime = new Date(track.ts).getTime()
        if (cutoff === 0 || trackTime >= cutoff) {
            if (!track.master_metadata_album_artist_name || !track.ms_played) return

            const key = track.master_metadata_track_name
            const prev = songMap.get(key)

            songMap.set(key, {
                artist: track.master_metadata_album_artist_name,
                ms: (prev?.ms || 0) + track.ms_played
            })
        }
    })

    const sorted = Array.from(songMap.entries())
        .map(([song, { artist, ms }]) => ({
            song,
            artist,
            minutes: Math.floor(ms / 1000 / 60),
        }))
        .sort((a, b) => b.minutes - a.minutes)

    topSongs.value = sorted
}

function calcGraphData() {
    const cutoff = time.value > 0 ? lastDate - time.value * 24 * 60 * 60 * 1000 : 0
    const tempMap = new Map<string, number>()

    allData.forEach((track) => {
        const trackTime = new Date(track.ts).getTime()
        if (cutoff === 0 || trackTime >= cutoff) {
            const day = new Date(track.ts).toISOString().slice(0, 10)
            const prev = tempMap.get(day) || 0
            tempMap.set(day, prev + track.ms_played)
        }
    })

    const finalMap = new Map<string, number>()
    tempMap.forEach((ms, day) => finalMap.set(day, Math.floor(ms / 1000 / 60)))
    listeningPerDay.value = finalMap

}

function calcCalendarData() {
    const tempMapPerDay = new Map<string, Map<string, number>>()

    allData.forEach((track) => {
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