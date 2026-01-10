<template>
    <div class="music-player-wrapper">
        <div class="music-player-badge shadow-lg d-flex flex-column p-2 rounded-pill shadow mb-2"
            :class="{ 'is-playing': isPlaying }">

            <div class="d-flex align-items-center w-100 px-1">
                <div class="album-art-mini me-2 shadow-sm position-relative" @click="showLyrics = true">
                    <img :src="ImageIntuated" alt="Art">
                    <div class="sound-waves me-2 position-absolute bottom-0" style="left:10px">
                        <div v-for="i in 4" :key="i" class="wave" :class="{ 'animate': isPlaying }"></div>
                    </div>
                </div>


                <div class="song-info me-3 flex-grow-1 ms-4" @click="showLyrics = true">
                    <div class="song-name">Infatuated - Rangga Jones ❤️</div>
                    <div class="mini-progress-container mt-1">
                        <input type="range" class="song-slider" min="0" :max="duration" step="0.1" v-model="currentTime"
                            @input="onSliderChange" @click.stop />
                    </div>
                </div>

                <button class="play-btn border-0 bg-transparent text-pink" @click="togglePlay">
                    <i :class="isPlaying ? 'pi pi-pause' : 'pi pi-play'"></i>
                </button>
            </div>
        </div>

        <Dialog v-model:visible="showLyrics" modal header="Lyrics" :style="{ width: '90vw', maxWidth: '400px' }"
            class="lyrics-dialog">
            <template #header>
                <div class="sound-waves me-2" @click="togglePlay">
                    <div v-for="i in 4" :key="i" class="wave" :class="{ 'animate': isPlaying }"></div>
                </div>
                <span>🎶 เนื้อเพลง</span>
            </template>
            <div class="lyrics-container" ref="lyricsContainer">
                <div v-for="(line, index) in lyrics" :key="index"
                    :ref="(el) => { if (index === currentLineIndex) activeLineRef = el }"
                    :class="['lyric-line', { 'active': currentLineIndex === index }]">

                    <div class="main-text">{{ line.text }}</div>

                    <div v-if="line.subText" class="sub-text">{{ line.subText }}</div>
                </div>
            </div>
            <template #footer>
                <div class="text-center w-100 text-muted small pb-2">
                    กำลังเล่นเพลงพิเศษสำหรับคุณ... ({{ formatTime(currentTime) }} / {{ formatTime(duration) }})
                </div>
            </template>
        </Dialog>

        <audio ref="audioRef" loop @timeupdate="onTimeUpdate" @loadedmetadata="onLoadedMetadata">
            <source :src="Infatuated" type="audio/mpeg" />
            Your browser does not support the audio element.
        </audio>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import Dialog from 'primevue/dialog';
import Infatuated from '@/assets/music/Infatuated.mp3'
import ImageIntuated from '@/assets/infatuated.jpg';
const isPlaying = ref(false);
const audioRef = ref(null);
const currentLineIndex = ref(0);
const activeLineRef = ref(null);
const showLyrics = ref(false);
const currentTime = ref(0);
const duration = ref(0);

const lyrics = [
    { time: 0, text: "🎶", subText: "(Intro - เพลงของเรา)" },
    { time: 32.34, text: "Sweet like caramel", subText: "หวานเหมือนคาราเมล" },
    { time: 36.70, text: "Whenever I taste it", subText: "เมื่อไหร่ก็ตามที่ฉันได้ลิ้มรสมัน" },
    { time: 39.57, text: "Baby can't you tell?", subText: "ที่รัก บอกไม่ได้เหรอ" },
    { time: 43.66, text: "That you are the reason that I", subText: "คุณคือเหตุผลที่ฉัน..." },
    { time: 46.27, text: "Stay up all night long", subText: "นอนไม่หลับทั้งคืน" },
    { time: 50.57, text: "Thinking about how soft your lips would feel on mine (mine)", subText: "คิดถึงริมฝีปากนุ่มๆ ของคุณที่สัมผัสกับฉัน" },
    { time: 61.03, text: "So come on over and we'll go", subText: "งั้นมาเลย แล้วเราจะไปกัน" },
    { time: 64.30, text: "Supersonic overload", subText: "พุ่งทะยานไปด้วยความเร็วเหนือเสียง" },
    { time: 67.53, text: "I'll be right here", subText: "ฉันจะอยู่ตรงนี้" },
    { time: 71.00, text: "I'll be right here", subText: "ฉันจะอยู่ตรงนี้" },
    { time: 74.82, text: "Never felt this way before", subText: "ไม่เคยรู้สึกแบบนี้มาก่อนเลย" },
    { time: 77.93, text: "Day and night I'm wanting more", subText: "ทั้งวันทั้งคืน ฉันต้องการมากกว่านี้" },
    { time: 81.05, text: "Oh baby I swear", subText: "โอ้ ที่รัก ฉันสาบานเลย" },
    { time: 84.44, text: "Oh baby I swear", subText: "โอ้ ที่รัก ฉันสาบานเลย" },
    { time: 88.81, text: "Oh you got me infatuated", subText: "โอ้ คุณทำให้ฉันหลงเสน่ห์จนถอนตัวไม่ขึ้น" },
    { time: 93.06, text: "Just by the way that you move", subText: "แค่เพียงท่าทางที่คุณเคลื่อนไหว" },
    { time: 98.28, text: "That you move", subText: "ที่คุณเคลื่อนไหว" },
    { time: 102.36, text: "No nothing else could make me feel the", subText: "ไม่มีอะไรอื่นอีกแล้วที่จะทำให้ฉันรู้สึก" },
    { time: 106.89, text: "Way that your body ever could", subText: "เหมือนที่ร่างกายของคุณทำให้ฉันรู้สึกได้" },
    { time: 112.47, text: "Ever could", subText: "ที่เคยทำได้" },
    { time: 116.85, text: "The way you walk with that confidence, yea", subText: "วิธีที่คุณเดินด้วยความมั่นใจนั้น" },
    { time: 120.38, text: "And when you talk with intelligence", subText: "และเวลาที่คุณพูดด้วยความชาญฉลาด" },
    { time: 122.64, text: "Oh my god", subText: "โอ้พระเจ้า" },
    { time: 126.02, text: "Oh my god", subText: "โอ้พระเจ้า" },
    { time: 130.62, text: "You got me begging for you every time", subText: "คุณทำให้ฉันต้องอ้อนวอนขอคุณทุกครั้งไป" },
    { time: 133.98, text: "The only thing that's running on my mind", subText: "สิ่งเดียวที่วิ่งวนอยู่ในหัวของฉัน" },
    { time: 136.48, text: "Is you", subText: "คือคุณคนเดียว" },
    { time: 139.44, text: "Is you", subText: "คือคุณคนเดียว" },
    { time: 142.97, text: "So come on over and we'll go", subText: "งั้นมาหาฉันสิ แล้วเราจะไปด้วยกัน" },
    { time: 146.55, text: "Supersonic overload", subText: "พุ่งทะยานไปด้วยความเร็วเหนือเสียง" },
    { time: 149.84, text: "I'll be right here", subText: "ฉันจะอยู่ตรงนี้" },
    { time: 153.30, text: "I'll be right here", subText: "ฉันจะอยู่ตรงนี้เสมอ" },
    { time: 156.96, text: "Never felt this way before", subText: "ไม่เคยรู้สึกแบบนี้มาก่อนเลย" },
    { time: 160.31, text: "Day and night I'm wanting more", subText: "ทั้งวันทั้งคืน ฉันต้องการมากกว่าเดิม" },
    { time: 163.47, text: "Oh baby I swear", subText: "โอ้ที่รัก ฉันสาบาน" },
    { time: 166.73, text: "Oh baby I swear", subText: "โอ้ที่รัก ฉันสาบาน" },
    { time: 171.18, text: "Oh you got me infatuated", subText: "โอ้ คุณทำให้ฉันหลงใหลเหลือเกิน" },
    { time: 175.31, text: "Just by the way that you move", subText: "แค่เพียงท่าทางที่คุณเคลื่อนไหว" },
    { time: 180.54, text: "That you move", subText: "ที่คุณเคลื่อนไหว" },
    { time: 184.72, text: "No nothing else could make me feel the", subText: "ไม่มีอะไรอื่นที่จะทำให้ฉันรู้สึก" },
    { time: 188.91, text: "Way that your body ever could", subText: "เหมือนที่ร่างกายของคุณทำได้" },
    { time: 194.56, text: "Ever could", subText: "เคยทำได้" },
    { time: 198.56, text: "Oh you got me infatuated", subText: "โอ้ คุณทำให้ฉันหลงรักจนหมดใจ" },
    { time: 202.75, text: "Just by the way that you move", subText: "แค่จากวิธีที่คุณเคลื่อนไหว" },
    { time: 207.91, text: "That you move", subText: "ที่คุณเคลื่อนไหว" },
    { time: 212.17, text: "No nothing else could make me feel the", subText: "ไม่มีอะไรอีกแล้วที่จะทำให้ฉันรู้สึกแบบนี้" },
    { time: 216.42, text: "Way that your body ever could", subText: "ในแบบที่สัมผัสจากคุณทำได้" },
    { time: 222.19, text: "Ever could", subText: "อย่างที่เคยเป็นมา" },
    { time: 223.73, text: "🎶 Happy Anniversary ❤️", subText: "สุขสันต์วันครบรอบนะ" }
];

const togglePlay = () => {
    if (isPlaying.value) {
        audioRef.value.pause();
    } else {
        audioRef.value.play().catch(() => { });
    }
    isPlaying.value = !isPlaying.value;
};

onMounted(() => {

    togglePlay()

});

const onLoadedMetadata = () => {
    duration.value = audioRef.value.duration;
};

const onSliderChange = () => {
    audioRef.value.currentTime = currentTime.value;
};

const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
};

const onTimeUpdate = () => {
    currentTime.value = audioRef.value.currentTime;
    const index = lyrics.findIndex((line, i) => {
        const nextLine = lyrics[i + 1];
        return currentTime.value >= line.time && (!nextLine || currentTime.value < nextLine.time);
    });

    if (index !== -1 && index !== currentLineIndex.value) {
        currentLineIndex.value = index;
        nextTick(() => {
            activeLineRef.value?.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        });
    }
};
</script>

<style scoped>
.music-player-wrapper {
    display: flex;
    justify-content: center;
}

.music-player-badge {
    z-index: 1000;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    width: 320px;
    height: auto;
}

.album-art-mini {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
}

.album-art-mini img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.text-pink {
    color: #d53f8c;
}

.song-name {
    font-size: 0.75rem;
    font-weight: bold;
    color: #d53f8c;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* Progress Slider */
.mini-progress-container {
    width: 100%;
    height: 12px;
    display: flex;
    align-items: center;
}

.song-slider {
    width: 100%;
    height: 3px;
    accent-color: #f687b3;
    cursor: pointer;
}

/* --- Sound Waves --- */
.sound-waves {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    height: 15px;
}

.wave {
    width: 3px;
    height: 6px;
    background: #f687b3;
    border-radius: 2px;
}

.wave.animate {
    animation: wavePulse 1.2s ease-in-out infinite;
}

.wave:nth-child(2).animate {
    animation-delay: 0.2s;
}

.wave:nth-child(3).animate {
    animation-delay: 0.4s;
}

@keyframes wavePulse {

    0%,
    100% {
        height: 6px;
    }

    50% {
        height: 15px;
    }
}

/* Lyrics Styling (คงเดิม) */
.lyrics-container {
    height: 450px;
    overflow-y: auto;
    padding: 200px 10px;
    /* ลด padding ข้างลงเล็กน้อย */
    scrollbar-width: none;
}

.lyrics-container::-webkit-scrollbar {
    display: none;
}

.lyric-line {
    padding: 20px 15px;
    text-align: center;
    transition: all 0.5s ease;
    opacity: 0.15;
    transform: scale(0.9);

    /* --- ส่วนที่แก้เรื่องข้อความยาว --- */
    width: 100%;
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
}

.lyric-line.active {
    opacity: 1;
    filter: blur(0);
    transform: scale(1.1);
}

.main-text {
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.4;
    /* เพิ่มระยะห่างบรรทัดให้พอดี */
    margin-bottom: 8px;
    display: block;
    /* บังคับให้เป็น Block เพื่อรองรับเนื้อหาเยอะ */
}

.active .main-text {
    color: #d53f8c;
    /* สีชมพูเข้มเมื่อ active */
}

.sub-text {
    font-size: 0.9rem;
    line-height: 1.3;
    display: block;
    color: #A0AEC0;
}

.active .sub-text {
    color: #f687b3;
    /* สีชมพูอ่อนเมื่อ active */
}

/* ปรับระยะห่างระหว่างบรรทัดเนื้อเพลง */
.lyrics-container {
    height: 450px;
    overflow-y: auto;
    padding: 200px 0;
    /* เว้นที่ว่างด้านบนและล่างเพื่อให้บรรทัด active อยู่กลางจอ */
    scrollbar-width: none;
}

.play-btn {
    font-size: 1.1rem;
    cursor: pointer;
}
</style>