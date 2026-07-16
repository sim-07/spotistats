<template>
    <div class="flex flex-col min-h-screen bg-[#1a1a1a] text-white antialiased">
        <Header></Header>

        <main class="flex flex-1 flex-col justify-center">
            <section class="mx-auto px-6 py-20 max-w-5xl">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    <div v-if="!showStats">
                        <SelectFolderYtMusic :handleFolder="handleFolderYtMusic" />
                    </div>

                    <div v-if="showStats" class="lg:col-span-12 mt-4 p-6 text-white mb-10">
                        <Stats v-model:time="time" v-model:selectedDay="selectedDay"
                            :totalListenedMinutes="totalPlays" :avgSongDuration="0"
                            :topArtists="topArtists" :topSongs="topSongs"
                            :listeningPerDayPerArtist="listeningPerDayPerArtist" :listeningPerDay="listeningPerDay"
                            :currentYearDays="currentYearDays" :dataYear="dataYear" />
                    </div>

                    <div v-if="showStats" class="lg:col-span-12 mt-4 p-6 text-white mb-10">
                        <Stats v-model:time="time" v-model:selectedDay="selectedDay"
                            :totalListenedMinutes="totalPlays" :avgSongDuration="0"
                            :topArtists="topArtists" :topSongs="topSongs"
                            :listeningPerDayPerArtist="listeningPerDayPerArtist" :listeningPerDay="listeningPerDay"
                            :currentYearDays="currentYearDays" :dataYear="dataYear" />
                    </div>

                </div>
            </section>
        </main>

        <footer class="mt-auto py-8 text-center text-sm text-gray-500">
            © 2025 YouTube Music Stats
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
import SelectFolderYtMusic from '../components/SelectFolderYtMusic.vue'
import Stats from '../components/Stats.vue'
import Header from '../components/Header.vue'

// 1. Interfaccia per leggere il JSON grezzo di YouTube Takeout
interface YTMHistoryRaw {
    header: string
    title: string
    titleUrl?: string
    subtitles?: { name: string; url: string }[]
    time: string
    products: string[]
}

// 2. Interfaccia pulita per l'elaborazione interna
interface ParsedTrack {
    ts: string
    trackName: string
    artistName: string
}

const showStats = ref(false)
const time = ref(30)
let allData: ParsedTrack[] = []

// Modificati da minuti a conteggio ascolti (plays)
const totalPlays = ref(0)
const topArtists = ref<{ artist: string; minutes: number }[]>([]) // Mantenuto 'minutes' come nome prop per non rompere Stats.vue, ma conterrà i PLAYS
const topSongs = ref<{ song: string; artist: string; minutes: number }[]>([]) 
const listeningPerDay = ref(new Map<string, number>())
const listeningPerDayPerArtist = ref(new Map<string, Map<string, number>>())
const dataYear = ref(new Date().getFullYear())

const selectedDay = ref(new Date())
let lastDate: number;
const currentYearDays = ref(1)

async function handleFolderYtMusic(event: Event) {
    const files = (event.target as HTMLInputElement).files
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)
    // Filtra solo i file che finiscono per .json (funziona sia che tu selezioni un singolo file sia multipli)
    const jsonFiles = fileArray.filter((f) => f.name.endsWith('.json'))

    if (jsonFiles.length === 0) {
        alert("Seleziona un file .json valido!");
        return;
    }

    const dataArray = await Promise.all(
        jsonFiles.map(
            (file) =>
                new Promise<ParsedTrack[]>((resolve) => {
                    const reader = new FileReader()
                    reader.onload = () => {
                        try {
                            const rawData = JSON.parse(reader.result as string)
                            
                            // Gestisce sia se Google Takeout ti dà un array di oggetti [], 
                            // sia se è un JSON strutturato diversamente
                            const list = Array.isArray(rawData) ? rawData : (rawData.events || [])

                            // Pulizia e mappatura dei dati
                            const mappedData: ParsedTrack[] = list
                                .filter((item: any) => item.header === "YouTube Music" && item.title)
                                .map((item: any) => {
                                    // Rimuove "Hai guardato " o "Watched "
                                    const trackName = item.title.replace(/^Hai guardato\s+|^Watched\s+/i, '').trim()
                                    
                                    // Prende l'artista e rimuove " - Topic"
                                    let artistName = 'Unknown Artist'
                                    if (item.subtitles && item.subtitles.length > 0) {
                                        artistName = item.subtitles[0].name.replace(/\s+-\s+Topic$/i, '').trim()
                                    }

                                    return {
                                        ts: item.time,
                                        trackName,
                                        artistName
                                    }
                                })

                            resolve(mappedData)
                        } catch (err) {
                            console.error(err)
                            console.warn(file.name + ' non è un JSON valido o è corrotto')
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

    lastDate = new Date(lastTrack.ts).getTime()

    dataYear.value = new Date(lastTrack.ts).getFullYear()
    const startOfYear = new Date(dataYear.value, 0, 1)

    currentYearDays.value = Math.floor((lastDate - startOfYear.getTime()) / (1000 * 60 * 60 * 24))

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
    let plays = 0
    const cutoff = time.value > 0 ? lastDate - time.value * 24 * 60 * 60 * 1000 : 0

    allData.forEach((track) => {
        const trackTime = new Date(track.ts).getTime()
        if (cutoff === 0 || trackTime >= cutoff) {
            plays++; // Ogni voce è un ascolto
        }
    })

    totalPlays.value = plays
}

function calculateTopArtists() {
    const artistMap = new Map<string, number>()
    const cutoff = time.value > 0 ? lastDate - time.value * 24 * 60 * 60 * 1000 : 0

    allData.forEach((track) => {
        const trackTime = new Date(track.ts).getTime()
        if (cutoff === 0 || trackTime >= cutoff) {
            const prev = artistMap.get(track.artistName) || 0
            artistMap.set(track.artistName, prev + 1) // Incrementa di 1 riproduzione
        }
    })

    const sorted = Array.from(artistMap.entries())
        .map(([artist, count]) => ({
            artist,
            minutes: count, // Passo il conteggio al posto dei minuti per compatibilità col componente
        }))
        .sort((a, b) => b.minutes - a.minutes)

    topArtists.value = sorted
}

function calculateTopSongs() {
    const songMap = new Map<string, { artist: string, count: number }>()
    const cutoff = time.value > 0 ? lastDate - time.value * 24 * 60 * 60 * 1000 : 0

    allData.forEach((track) => {
        const trackTime = new Date(track.ts).getTime()
        if (cutoff === 0 || trackTime >= cutoff) {
            const key = track.trackName
            const prev = songMap.get(key)

            songMap.set(key, {
                artist: track.artistName,
                count: (prev?.count || 0) + 1 // Incrementa di 1 riproduzione
            })
        }
    })

    const sorted = Array.from(songMap.entries())
        .map(([song, { artist, count }]) => ({
            song,
            artist,
            minutes: count, // Passo il conteggio al posto dei minuti per compatibilità
        }))
        .sort((a, b) => b.minutes - a.minutes)

    topSongs.value = sorted
}

function calcGraphData() {
    const cutoff = time.value > 0 ? lastDate - time.value * 24 * 60 * 60 * 1000 : 0
    const finalMap = new Map<string, number>()

    allData.forEach((track) => {
        const trackTime = new Date(track.ts).getTime()
        if (cutoff === 0 || trackTime >= cutoff) {
            const day = new Date(track.ts).toISOString().slice(0, 10)
            const prev = finalMap.get(day) || 0
            finalMap.set(day, prev + 1) // Aggiunge 1 ascolto per quel giorno
        }
    })

    listeningPerDay.value = finalMap
}

function calcCalendarData() {
    const tempMapPerDay = new Map<string, Map<string, number>>()

    allData.forEach((track) => {
        const day = new Date(track.ts).toISOString().slice(0, 10)
        const artist = track.artistName

        let artistMap = tempMapPerDay.get(day)
        if (!artistMap) {
            artistMap = new Map<string, number>()
            tempMapPerDay.set(day, artistMap)
        }

        const prevPlays = artistMap.get(artist) || 0
        artistMap.set(artist, prevPlays + 1)
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