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

        <MusicPlayer />

        <AnniversaryTimer />

        <PhotoGallery />

        <SurpriseLetter />

        <footer class="mt-4 text-center text-muted fst-italic pb-5">
          ❤️ สร้างด้วยความรักสำหรับเจ้าฟิล์ม ❤️
        </footer>

      </div>
    </div>
    <transition name="fade">
      <div v-if="showScrollButton" class="scroll-down-hint" @click="scrollDown">
        <span class="hint-text font-handwriting">เลื่อนลงดูสิ...</span>
        <div class="arrow-box shadow">
          <i class="pi pi-chevron-down"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import AnniversaryTimer from '@/components/AnniversaryTimer.vue'
import PhotoGallery from '@/components/PhotoGallery.vue'
import SurpriseLetter from '@/components/SurpriseLetter.vue'
import MusicPlayer from '@/components/MusicPlayer.vue';

import { useAnniversaryStore } from '@/stores/Anniversary'
import moment from 'moment'

// --- Store & Anniversary Logic ---
const store = useAnniversaryStore()

const anniversaryYears = computed(() => {
  const anniversaryDate = store.getANVDate
  const today = moment()

  // เช็คว่าวันนี้เป็นวันครบรอบ (วันที่และเดือนตรงกัน) หรือไม่
  const isAnniversaryDay = today.format('DD-MM') === moment(anniversaryDate).format('DD-MM')

  if (isAnniversaryDay) {
    return today.diff(anniversaryDate, 'years')
  }
  return null
})

const getOrdinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return (s[(v - 20) % 10] || s[v] || s[0]);
}

// --- Scroll Logic ---
const showScrollButton = ref(false)

const checkScrollRequirement = () => {
  // 1. ตำแหน่ง Scroll อยู่ด้านบน (ห่างจากขอบไม่เกิน 100px)
  const isAtTop = window.scrollY < 100

  // 2. เช็คว่าความสูงเนื้อหาล้นหน้าจอออกมาหรือไม่
  const hasMoreContent = document.documentElement.scrollHeight > window.innerHeight + 60

  showScrollButton.value = isAtTop && hasMoreContent
}

const scrollDown = () => {
  window.scrollTo({
    top: window.innerHeight * 0.6,
    behavior: 'smooth'
  })
}

onMounted(() => {
  // เช็คทันทีที่ mount และหลังจากรูปภาพ/ข้อมูลโหลดเสร็จเล็กน้อย
  checkScrollRequirement()
  setTimeout(checkScrollRequirement, 1000)

  window.addEventListener('scroll', checkScrollRequirement)
  window.addEventListener('resize', checkScrollRequirement)
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScrollRequirement)
  window.removeEventListener('resize', checkScrollRequirement)
})
</script>

<style scoped>
/* --- Colors --- */
.text-pink {
  color: #d53f8c;
}

.text-pink-light {
  color: #f687b3;
}

/* --- Typography --- */
.font-handwriting {
  font-family: 'Caveat', cursive;
  /* อย่าลืม import font ใน main.css */
}

.ordinal {
  font-size: 0.5em;
  margin-left: 2px;
  top: -0.8em;
  opacity: 0.8;
  font-weight: 400;
  text-transform: lowercase;
}

/* --- Scroll Indicator Styles --- */
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

/* --- Animations --- */
@keyframes bounce-float {

  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }

  40% {
    transform: translateY(-8px);
  }

  60% {
    transform: translateY(-4px);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(15px);
}

/* --- Extra Mobile Adjustments --- */
@media (max-width: 576px) {
  .display-5 {
    font-size: 2.2rem;
  }
}
</style>