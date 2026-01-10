<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <header class="text-center mb-3">
          <h1 class="display-5 fw-bold text-pink pt-2">Happy
            <span v-if="Anniversary()">{{ Anniversary() }}
              <sup class="ordinal">{{ getOrdinal(Anniversary()) }}</sup>

            </span> Anniversary
          </h1>
          <p class="fs-4 text-pink-light font-handwriting">to the most special person in my life</p>
        </header>
        <AnniversaryTimer />
        <PhotoGallery />
        <SurpriseLetter />
        <footer class="mt-3 text-center text-muted fst-italic pb-5">
          สร้างด้วยความรักสำหรับคนพิเศษ
        </footer>
      </div>
    </div>

  </div>
</template>

<script setup>
import AnniversaryTimer from '@/components/AnniversaryTimer.vue'
import PhotoGallery from '@/components/PhotoGallery.vue'
import SurpriseLetter from '@/components/SurpriseLetter.vue'
import { useAnniversaryStore } from '@/stores/Anniversary';
import moment from 'moment';

const store = useAnniversaryStore()
const Anniversary = () => {
  let AnniversaryDate = store.getANVDate
  let nowDate = moment().format('DD-MM')
  if (moment(AnniversaryDate).format('DD-MM') == nowDate) {
    return moment().diff(AnniversaryDate, 'year')
  } else {
    return ''
  }
}
const getOrdinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return (s[(v - 20) % 10] || s[v] || s[0]);
};
</script>

<style scoped>
.text-pink {
  color: #d53f8c;
}

.text-pink-light {
  color: #f687b3;
}

.bounce-animation {
  animation: bounce 2s infinite;
}

.anniversary-text {
  font-family: 'font-handwriting', sans-serif;
  font-size: 2.5rem;
  color: #d53f8c;
  font-weight: 500;
}

.ordinal {
  font-size: 0.5em;
  margin-left: 2px;
  top: -0.8em;
  opacity: 0.8;
  font-weight: 400;
  text-transform: lowercase;
}

@keyframes bounce {

  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }

  40% {
    transform: translateY(-10px);
  }

  60% {
    transform: translateY(-5px);
  }
}
</style>