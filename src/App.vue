<template>
  <div class="main-layout glass-morphism">
    <div class="heart-container">
      <i v-for="n in 3" :key="'left-' + n" class="pi pi-heart-fill heart side-left"
        :style="{ animationDelay: `${n * 1.5}s`, left: `${n * 4}%` }"></i>

      <i v-for="n in 3" :key="'right-' + n" class="pi pi-heart-fill heart side-right"
        :style="{ animationDelay: `${(n * 1.5) + 0.7}s`, right: `${n * 4}%` }"></i>
    </div>

    <router-view v-slot="{ Component }">
      <transition name="hug" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>
<script setup>
</script>
<style>
.main-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #fff5f7 0%, #fed7e2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.glass-morphism {
  width: 100%;
  min-height: 100vh;
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  z-index: 1;
}

.heart-container {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.heart {
  position: absolute;
  bottom: -50px;
  font-size: 160px;
  color: #f687b3;
  opacity: 0;
  animation: float-minimal 6s ease-in-out infinite;
}

@keyframes float-minimal {
  0% {
    transform: translateY(0);
    opacity: 0;
  }

  20% {
    opacity: 0.3;
  }

  80% {
    opacity: 0.3;
  }

  100% {
    transform: translateY(-110vh);
    opacity: 0;
  }
}

/* --- Hug Transition (คงเดิม) --- */
.hug-enter-active,
.hug-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.hug-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

.hug-enter-from {
  opacity: 0;
  transform: scale(1.02);
}
</style>