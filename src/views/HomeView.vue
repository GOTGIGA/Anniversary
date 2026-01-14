<template>
  <div class="container-fluid min-vh-100 position-relative">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">

        <header class="text-center mb-3">
          <h1 class="display-5 fw-bold text-pink pt-4">
            Happy
            <span v-if="anniversaryYears">
              {{ anniversaryYears }}<sup class="ordinal">{{ getOrdinal(anniversaryYears) }}</sup>
            </span>
            Anniversary
          </h1>
          <p class="fs-4 text-pink-light font-handwriting">To the most special person in my life</p>
        </header>

        <div class="music-player-placeholder" ref="placeholderRef"></div>

        <Teleport to="body">
          <div 
            :class="['music-teleport-wrapper', { 'is-sticky': isSticky }]" 
            :style="stickyStyle"
          >
            <div class="container-width-limit">
              <MusicPlayer ref="playerRef" @active-lyric="activeLyric"/>
            </div>
          </div>
        </Teleport>

        <AnniversaryTimer />
        <PhotoGallery />
        <SurpriseLetter />

        <footer class="mt-4 text-center text-muted fst-italic">
          <div class="pb-2">❤️ สร้างด้วยความรักสำหรับเจ้าฟิล์ม ❤️</div>
          <Comment />
        </footer>

      </div>
    </div>

    <transition name="fade">
      <div v-if="showScrollButton" class="scroll-down-hint" @click="scrollDown">
        <span class="hint-text fs-4">เลื่อนลงดูสิ...</span>
        <div class="arrow-box shadow">
          <i class="pi pi-chevron-down"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import AnniversaryTimer from '@/components/AnniversaryTimer.vue'
import PhotoGallery from '@/components/PhotoGallery.vue'
import SurpriseLetter from '@/components/SurpriseLetter.vue'
import MusicPlayer from '@/components/MusicPlayer.vue'
import Comment from '@/components/Comment.vue'
import { useAnniversaryStore } from '@/stores/Anniversary'
import moment from 'moment'

// --- State ---
const LyricsActive = ref(false)
const scrollSticky = ref(false) // เก็บสถานะการ Scroll
const showScrollButton = ref(false)
const placeholderRef = ref(null)
const initialTop = ref(0)
const store = useAnniversaryStore()

// --- Computed ---
const anniversaryYears = computed(() => {
  const anniversaryDate = store.getANVDate
  const today = moment()
  if (today.format('DD-MM') === moment(anniversaryDate).format('DD-MM')) {
    return today.diff(anniversaryDate, 'years')
  }
  return null
})

// รวมเงื่อนไข: ถ้า scroll เลยจุด หรือ ถ้ากำลังเปิดเนื้อเพลง ให้เป็น Sticky
const isSticky = computed(() => {
  return scrollSticky.value || LyricsActive.value
})

const stickyStyle = computed(() => {
  if (isSticky.value) {
    return {
      position: 'fixed',
      top: '15px',
      left: '0',
      right: '0',
      zIndex: 2000
    }
  } else {
    return {
      position: 'absolute',
      top: `${initialTop.value}px`,
      left: '0',
      right: '0',
      zIndex: 2000
    }
  }
})

// --- Methods ---
function activeLyric(value) {
  LyricsActive.value = value
}

const getOrdinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return (s[(v - 20) % 10] || s[v] || s[0]);
}

const updatePositions = () => {
  if (placeholderRef.value) {
    const rect = placeholderRef.value.getBoundingClientRect()
    initialTop.value = rect.top + window.scrollY
  }

  const scrollY = window.scrollY
  showScrollButton.value = scrollY < 100 && (document.documentElement.scrollHeight > window.innerHeight + 60)
  
  // อัปเดตสถานะ Sticky จากการ Scroll
  scrollSticky.value = scrollY > (initialTop.value - 15)
}

const scrollDown = () => {
  window.scrollTo({ top: window.innerHeight * 0.6, behavior: 'smooth' })
}

// --- Lifecycle ---
onMounted(() => {
  nextTick(() => {
    updatePositions()
    // หน่วงเวลาเล็กน้อยกรณีรูปภาพหรือ Element อื่นๆ โหลดช้าจนทำให้ Layout เปลี่ยน
    setTimeout(updatePositions, 500)
  })

  window.addEventListener('scroll', updatePositions)
  window.addEventListener('resize', updatePositions)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updatePositions)
  window.removeEventListener('resize', updatePositions)
})
</script>

<style scoped>
.music-player-placeholder {
  min-height: 80px;
  width: 100%;
  margin-bottom: 20px;
}

.music-teleport-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  /* ใส่ Transition เพื่อให้ตอนดีดขึ้นไปติดขอบบนดูนุ่มนวล */
  transition: top 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s ease;
}

/* เมื่อเป็น Sticky ให้ปิด Pointer-events ของ Wrapper เพื่อให้กดปุ่มข้างหลังได้ (ถ้ามี) */
.music-teleport-wrapper.is-sticky {
  pointer-events: none;
}

.container-width-limit {
  width: 100%;
  max-width: 540px;
  padding: 0 15px;
  display: flex;
  justify-content: center;
  /* เปิด Pointer-events เฉพาะตัวเครื่องเล่นเพลง */
  pointer-events: auto;
}

/* ปรับแต่ง Style เมื่อ Sticky (ผ่าน Deep Selector เพื่อส่งไปยัง Component ลูก) */
.is-sticky :deep(.music-player-badge) {
  transform: scale(0.95);
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 25px rgba(213, 63, 140, 0.15) !important;
}

.text-pink { color: #d53f8c; }
.text-pink-light { color: #f687b3; }


.ordinal {
  font-size: 0.5em;
  margin-left: 2px;
  top: -0.8em;
  opacity: 0.8;
  font-weight: 400;
  text-transform: lowercase;
}

.scroll-down-hint {
  position: fixed;
  top: 83vh;
  right: 10px;
  z-index: 100;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.hint-text {
  color: #d53f8c;
  font-size: 1.1rem;
  text-shadow: 1px 1px 4px rgba(255, 255, 255, 0.8);
}

.arrow-box {
  width: 45px;
  height: 45px;
  background-color: #ed64a6;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  animation: bounce-float 2s infinite;
}

@keyframes bounce-float {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-8px); }
  60% { transform: translateY(-4px); }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(15px);
}

@media (max-width: 576px) {
  .display-5 { font-size: 2.2rem; }
}
</style>