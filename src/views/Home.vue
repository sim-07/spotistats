<template>
    <div v-if="!showStats" class="fixed inset-0 z-0 pointer-events-none" style="background-color: #222222;">
        <DarkVeil :hue-shift="0" :noise-intensity="0" :scanline-intensity="0" :speed="1.0" :scanline-frequency="0"
            :warp-amount="0" :resolution-scale="1" />
    </div>

    <div class="relative z-10 flex flex-col min-h-screen text-white antialiased"
        :class="showStats ? 'bg-[#222222]' : 'bg-transparent'">
        <Header></Header>

        <main class="flex flex-1 flex-col justify-center">
            <section class="mx-auto px-2 sm:px-6 py-12 sm:py-20 max-w-5xl w-full">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    <div v-if="!showStats" class="lg:col-span-12 flex flex-col gap-8 sm:gap-12 items-center w-full">

                        <div
                            class="w-full max-w-xl bg-neutral-900/60 backdrop-blur-md p-4 sm:p-8 rounded-2xl border border-neutral-800 shadow-2xl flex flex-col gap-6">
                            <SelectFolderSpotify :handleFolder="handleFolderSpotify" />

                            <div class="border-t border-neutral-800/80 pt-4 text-xs text-neutral-400 space-y-3">
                                <div class="flex items-center justify-between">
                                    <span class="font-semibold text-neutral-300">How to get your data:</span>
                                    <a href="https://www.spotify.com/account/privacy/" target="_blank"
                                        class="text-emerald-400 hover:text-emerald-300 transition underline flex items-center gap-1">
                                        Spotify Privacy
                                        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                </div>
                                <ul class="list-disc list-inside space-y-1 pl-1 text-neutral-400">
                                    <li>Go to your Spotify Account settings and open the Privacy page.</li>
                                    <li>Request your Extended Streaming History data.</li>
                                    <li>Extract the zip file you receive via email and upload that folder here.</li>
                                </ul>
                            </div>
                        </div>

                        <div
                            class="w-full max-w-xl bg-neutral-900/60 backdrop-blur-md p-4 sm:p-8 rounded-2xl border border-neutral-800 shadow-2xl flex flex-col gap-6">
                            <SelectFolderYtMusic :handleFolder="handleFolderYtMusic" />

                            <div class="border-t border-neutral-800/80 pt-4 text-xs text-neutral-400 space-y-3">
                                <div class="flex items-center justify-between">
                                    <span class="font-semibold text-neutral-300">How to get your data:</span>
                                    <a href="https://takeout.google.com/" target="_blank"
                                        class="text-red-400 hover:text-red-300 transition underline flex items-center gap-1">
                                        Google Takeout
                                        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                </div>
                                <ul class="list-disc list-inside space-y-1 pl-1 text-neutral-400">
                                    <li>On Google Takeout, deselect everything and check only YouTube and YouTube Music.
                                    </li>
                                    <li>Under options, select only History and deselect all other data formats.</li>
                                    <li>Extract the downloaded zip file and upload the Json here (Takeout > Youtube
                                            Music > History > view history.json).</li>
                                </ul>
                            </div>
                        </div>

                    </div>

                    <div v-if="showStats" class="lg:col-span-12 mt-4 px-1 py-4 sm:p-6 text-white mb-10">
                        <Stats v-model:time="time" v-model:selectedDay="selectedDay"
                            :totalListenedMinutes="totalListenedMinutes" :avgSongDuration="avgSongDuration"
                            :topArtists="topArtists" :topSongs="topSongs"
                            :listeningPerDayPerArtist="listeningPerDayPerArtist" :listeningPerDay="listeningPerDay"
                            :currentYearDays="currentYearDays" :dataYear="dataYear" :service="service" />
                    </div>

                </div>
            </section>

            <section v-if="!showStats" class="mt-20 mb-10 w-full max-w-5xl mx-auto px-4 text-center">
                <h2 class="text-2xl font-bold text-white mb-8">Example outputs</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="bg-neutral-900/50 p-2 rounded-xl border border-neutral-800">
                        <img src="/screen1.png" alt="Stats Overview" class="rounded-lg w-full h-auto" />
                    </div>
                    <div class="bg-neutral-900/50 p-2 rounded-xl border border-neutral-800">
                        <img src="/screen2.png" alt="Detailed Analysis" class="rounded-lg w-full h-auto" />
                    </div>
                </div>
            </section>
        </main>

        <footer class="mt-auto py-8 text-center text-sm text-neutral-500">
            © 2026 Music Stats
        </footer>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import DarkVeil from '../DesignComponent/DarkVeil.vue'
import SelectFolderSpotify from '../components/SelectFolderSpotify.vue'
import SelectFolderYtMusic from '../components/SelectFolderYtMusic.vue'
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
const topArtists = ref<{ artist: string; val: number }[]>([])
const topSongs = ref<{ song: string; artist: string; val: number }[]>([])
const listeningPerDay = ref(new Map<string, number>())
const listeningPerDayPerArtist = ref(new Map<string, Map<string, number>>())

const dataYear = ref(new Date().getFullYear())

const selectedDay = ref(new Date())
let lastDate: number
const currentYearDays = ref(1)
let avgSongDuration: number
let service: string

async function handleFolderYtMusic(event: Event) {
    const files = (event.target as HTMLInputElement).files
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)
    const jsonFiles = fileArray.filter((f) => f.name.endsWith('.json'))

    if (jsonFiles.length === 0) {
        alert("Json is not valid");
        return;
    }

    const dataArray = await Promise.all(
        jsonFiles.map(
            (file) =>
                new Promise<historyProps[]>((resolve) => {
                    const reader = new FileReader()
                    reader.onload = () => {
                        try {
                            const rawData = JSON.parse(reader.result as string)
                            const list = Array.isArray(rawData) ? rawData : (rawData.events || [])

                            const mappedData: historyProps[] = list
                                .filter((item: any) => item.header === "YouTube Music" && item.title)
                                .map((item: any) => {
                                    const trackName = item.title.replace(/^Hai guardato\s+|^Watched\s+/i, '').trim()

                                    let artistName = 'Unknown Artist'
                                    if (item.subtitles && item.subtitles.length > 0) {
                                        artistName = item.subtitles[0].name.replace(/\s+-\s+Topic$/i, '').trim()
                                    }

                                    return {
                                        ts: item.time,
                                        ms_played: 210000,
                                        master_metadata_track_name: trackName,
                                        master_metadata_album_artist_name: artistName
                                    }
                                })

                            resolve(mappedData)
                        } catch (err) {
                            console.error(err)
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

    if (allData.length === 0) return

    service = "yt"

    processStatsAndRedirect()
}

async function handleFolderSpotify(event: Event) {
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

    if (allData.length === 0) return

    service = "spotify"

    processStatsAndRedirect()
}

function processStatsAndRedirect() {
    const lastTrack = allData[allData.length - 1]
    lastDate = new Date(lastTrack.ts).getTime()

    dataYear.value = new Date(lastTrack.ts).getFullYear()
    const startOfYear = new Date(dataYear.value, 0, 1)
    currentYearDays.value = Math.floor((lastDate - startOfYear.getTime()) / (1000 * 60 * 60 * 24))

    selectedDay.value = new Date(lastTrack.ts)
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
    avgSongDuration = Number(((totalListened / 1000 / 60) / (tracks || 1)).toFixed(2))
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

    topArtists.value = Array.from(artistMap.entries())
        .map(([artist, ms]) => ({ artist, val: Math.floor(ms / 1000 / 60) }))
        .sort((a, b) => b.val - a.val)
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

    topSongs.value = Array.from(songMap.entries())
        .map(([song, { artist, ms }]) => ({ song, artist, val: Math.floor(ms / 1000 / 60) }))
        .sort((a, b) => b.val - a.val)
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
        const sortedArtists = Array.from(artistMap.entries()).sort((a, b) => b[1] - a[1])
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