<!-- VMenu.vue -->
<template>
  <nav class="v-menu-container">
    <div class="v-menu-bar">
      <!-- LEFT: Persistent Slot (Logo) -->
      <div class="v-menu-side">
        <slot name="persistent-left"></slot>
      </div>

      <!-- RIGHT GROUP: Contains Nav, Search Slot, and Hamburger -->
      <div class="v-menu-right-group">
        
        <!-- NAVIGATION: Desktop horizontal / Mobile drawer -->
        <div class="v-menu-nav" :class="{ 'mobile-open': isMobileMenuOpen }">
          <ul class="level-1-list">
            <li v-for="item in items" :key="item.label" class="level-1-item">
              
              <!-- Level 1 Link/Toggle -->
              <div 
                class="nav-link level-1-link" 
                @click="handleLevel1Click(item)"
                :class="{ 'has-children': item.children?.length, 'is-expanded': expandedItem === item.label }"
              >
                <span v-if="item.children?.length" class="arrow">▾</span>
                {{ item.label }}
              </div>

              <!-- Level 2 Submenu -->
              <transition name="slide-fade">
                <ul v-if="expandedItem === item.label && item.children?.length" class="level-2-list">
                  <li v-for="subItem in item.children" :key="subItem.label">
                    <router-link 
                      :to="subItem.to" 
                      class="nav-link level-2-link" 
                      @click="closeAll"
                    >
                      {{ subItem.label }}
                    </router-link>
                  </li>
                </ul>
              </transition>
            </li>
          </ul>
        </div>

        <!-- RIGHT: Persistent Slot (Search) -->
        <slot name="persistent-right"></slot>
        
        <!-- MOBILE: Hamburger Button -->
        <button 
          class="hamburger" 
          @click.stop="toggleMobileMenu" 
          :class="{ 'is-active': isMobileMenuOpen }"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    required: true
  }
});

const isMobileMenuOpen = ref(false);
const expandedItem = ref(null);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  if (!isMobileMenuOpen.value) expandedItem.value = null;
};

const handleLevel1Click = (item) => {
  if (item.children?.length) {
    // If it has a submenu, toggle visibility
    expandedItem.value = expandedItem.value === item.label ? null : item.label;
  } else {
    // If it's a direct link, close menu (router-link handles nav)
    closeAll();
  }
};

const closeAll = () => {
  isMobileMenuOpen.value = false;
  expandedItem.value = null;
};

// Close menu when clicking outside the component
const handleClickOutside = (event) => {
  if (!event.target.closest('.v-menu-container')) {
    closeAll();
  }
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));
</script>

<style scoped>
/* 1. CONTAINER & BAR */
.v-menu-container {
  position: sticky;
  top: 0;
  width: 100%; /* Uses 100% instead of 100vw to prevent horizontal scrollbar */
  z-index: 1000;
  background-color: var(--white);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.v-menu-bar {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  height: 70px;
}

.v-menu-side {
  display: flex;
  align-items: center;
}

.v-menu-right-group {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

/* 2. DESKTOP NAVIGATION */
.level-1-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.level-1-item {
  position: relative;
}

.nav-link {
  color: var(--text-dark);
  text-decoration: none;
  padding: 0.8rem 1.2rem;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  justify-content: flex-end;
  text-align: right;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  white-space: normal;       /* Allows text to wrap to the next line */
  overflow-wrap: break-word; /* Breaks extremely long words if necessary */
  line-height: 1.4;           /* Adds space between lines for readability */
  align-items: flex-start;    /* Aligns the arrow/icon to the top of the text */
}

.nav-link:hover {
  color: var(--primary-green);
}

.level-1-link.is-expanded {
  color: var(--primary-green);
}

/* Desktop Level 2 Dropdown */
.level-2-list {
  position: absolute;
  top: 100%;
  right: 0; /* Right-align the dropdown items */
  background: var(--white);
  min-width: 200px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  border-radius: 8px;
  list-style: none;
  padding: 0.5rem 0;
  border: 1px solid var(--border-color);
}

.level-2-link {
  padding: 0.7rem 1.5rem;
  font-size: 0.95rem;
  justify-content: flex-end;
}

.level-2-link:hover {
  background-color: var(--soft-green);
}

/* 3. HAMBURGER ICON */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 18px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1100;
}

.hamburger span {
  width: 100%;
  height: 2px;
  background: var(--primary-green);
  border-radius: 2px;
  transition: 0.3s;
}

/* 4. MOBILE DRAWER STYLES */
/* Tablet width */
@media (max-width: 1400px) {
  .hamburger {
    display: flex;
  }

  .v-menu-nav {
    position: fixed;
    top: 0;
    right: 0;
    width: 50%; /* Requirement: 50% window width */
    height: 100vh;
    background: var(--white);
    box-shadow: -10px 0 30px rgba(0,0,0,0.1);
    padding-top: 80px;
    transform: translateX(100%); /* Hidden by default */
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1050;
    overflow-y: auto;
    display: block;
  }

  .v-menu-nav.mobile-open {
    transform: translateX(0); /* Slide in */
  }

  .level-1-list {
    flex-direction: column;
    width: 100%;
  }

  .nav-link {
    justify-content: flex-end; /* Requirement: Right-aligned text */
    text-align: right;
    padding: 1.2rem 2rem;
    font-size: 1.1rem;
    border-bottom: 1px solid var(--soft-green);
  }

  .level-2-list {
    position: static;
    box-shadow: none;
    background: var(--soft-green);
    width: 100%;
    border: none;
    border-radius: 0;
    padding: 0;
  }

  .level-2-link {
    padding-right: 3.5rem; /* Additional indent for sub-items while right-aligned */
    border-bottom: 1px solid rgba(0,0,0,0.03);
  }

  .arrow {
    order: 2; /* Move arrow after text in right-aligned layout */
  }
}

/* Phone width */
@media (max-width: 600px) {
  .v-menu-nav {
    width: 80%; /* Phones: give the text more room to breathe */
  }
}

/* 5. TRANSITIONS */
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from, .slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>