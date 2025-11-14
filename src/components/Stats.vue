<template>
    <!-- <div class="flex items-center gap-5">
        <select v-model="time" class="p-2 rounded text-black">
            <option :value="30">1 month</option>
            <option :value="180">6 months</option>
            <option :value="currentYearDays">{{ new Date().getFullYear() }}</option>
            <option :value="365">1 year</option>
            <option :value="0">All</option>
        </select>
    </div>

    <h1 class="text-2xl font-semibold mt-10">Summary</h1>

    <div class="mt-6 bg-[#2d2d2d] p-5 rounded-md space-y-4">
        <h2 class="text-lg font-semibold">
            Total listened:
            <span class="text-2xl font-bold ml-2">{{ totalListenedMinutes }}</span> minutes =
            <span class="text-2xl font-bold ml-2">{{ Math.floor(totalListenedMinutes / 60) }}</span>
            hours =
            <span class="text-2xl font-bold ml-2">{{ Math.floor(totalListenedMinutes / 60 / 24)
            }}</span> days
        </h2>

        <h2 class="text-lg font-semibold">
            Unique artists:
            <span class="text-2xl font-bold ml-2">{{ topArtists.length }}</span> artists
        </h2>

        <h2 class="text-lg font-semibold">
            Unique songs:
            <span class="text-2xl font-bold ml-2">{{ topSongs.length }}</span> songs
        </h2>

        <h2 class="text-lg font-semibold">
            Average song duration:
            <span class="text-2xl font-bold ml-2">{{ avgSongDuration }}</span> min
        </h2>
    </div>

    <h2 class="text-2xl mb-4 mt-20">Top artists</h2>
    <div class="mt-8 h-[715px] overflow-y-auto bg-[#2d2d2d] p-5 rounded-md">
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
                        <td class="px-4 py-3 align-top break-words">{{ item.artist }}</td>
                        <td class="px-4 py-3 align-top">{{ item.minutes > 0 ? item.minutes : '<1' }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div v-if="topArtists.length > 10" class="mt-4">
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
                        <td class="px-4 py-3 align-top break-words">{{ item.song }}</td>
                        <td class="px-4 py-3 align-top break-words">{{ item.artist }}</td>
                        <td class="px-4 py-3 align-top">{{ item.minutes > 0 ? item.minutes : '<1' }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

    </div>
    <div v-if="topSongs.length > 10" class="mt-4">
        <button @click="showAllSongs = !showAllSongs"
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white font-medium shadow-md transition">
            {{ showAllSongs ? 'Show less' : 'View all' }}
        </button>
    </div>

    <div class="mt-10 bg-[#2d2d2d] p-5 rounded-md">
        <div class="mt-16 chart-wrapper mb-10">
            <LineChart :data="chartData" :options="chartOptions" />
        </div>

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

    </div> -->

</template>

<script setup lang="ts">
// const emit = defineEmits<{
//   (e: 'update:time', value: number): void
// }>()

// defineProps<{
//     time: number
//     selectedDay: Date
//     showAllArtists: boolean
//     showAllSongs: boolean
//     currentYearDays: number
//     totalListenedMinutes: number
//     avgSongDuration: number
//     topArtists: { artist: string; minutes: number }[]
//     topSongs: { song: string; artist: string; minutes: number }[]
//     displayedArtists: { artist: string; minutes: number }[]
//     displayedSongs: { song: string; artist: string; minutes: number }[]
//     chartData: any
//     chartOptions: any
//     listeningPerDayPerArtist: Map<string, Map<string, number>>
// }>()

</script>