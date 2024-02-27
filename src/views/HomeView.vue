
<template>
  <div class="dashboard">
    Hello Beautiful World
    <!-- <input class="search-bar" type="text" placeholder="Search..." v-model="state.search" />

    <div class="card-container">
      <div class="card" v-for="(card, index) in filteredCards" :key="index">
        <div class="card-icon">
          <component
            v-if="PageIconMap.has(card.pageName)"
            :is="PageIconMap.get(card.pageName)"
          ></component>
        </div>
        <div >
          <h2 class="card-title">{{ card.title }}</h2>
          <router-link
            class="card-button"
            v-for="(button, index) in card.buttons"
            :key="index"
            :to="{ name: button.to }"
            >{{ button.name }}</router-link
          >
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { usePermissionStore } from '@/stores/permissionStore'
import { permissionGroupMap } from './permissionManagement/authorityManagement/permissionCheckDisabled'
import { PageIconMap } from '@/components/icons/IconIndex'

const permissionStore = usePermissionStore()

interface Card {
  title: string
  pageName: string
  buttons: Array<{ name: string; to: string }>
}

const state = reactive<{ search: string; cards: Card[] }>({
  search: '',
  cards: []
})

let filteredCards = computed(() =>
  state.cards.filter((card: Card) => card.title.toLowerCase().includes(state.search.toLowerCase()))
)

function flattenPermissionMap(permissionMap: any[], parentName: string = '') {
  let result: any[] = []
  permissionMap.forEach((item: any) => {
    const { name, sub_menu_list, permissions } = item
    const permissionView = permissions.some(
      (item: { access_type: string }) => item.access_type === 'PermissionAccessType_View'
    )
    if (permissionView) {
      result.push({
        name,
        parentName
      })
    }

    if (sub_menu_list.length > 0) {
      result = result.concat(flattenPermissionMap(item.sub_menu_list, name))
    }
  })
  return result
}

watch(
  () => permissionStore.userPermissionMap,
  (newValue) => {
    let result: Card[] = []
    const list = flattenPermissionMap(newValue)
    const getParentName = list
      .filter((item) => item.parentName !== '')
      .map((item) => item.parentName)
    ;[...new Set(getParentName)].forEach((item) => {
      const children = list.filter((child) => child.parentName === item)
      const card: Card = {
        title: permissionGroupMap.has(item) ? permissionGroupMap.get(item) : item,
        pageName: item,
        buttons: children.map((child) => {
          return {
            name: permissionGroupMap.has(child.name)
              ? permissionGroupMap.get(child.name)
              : child.name,
            to: `${child.name}`
          }
        })
      }
      result.push(card)
    })
    state.cards = result
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.dashboard {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.search-bar {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  box-sizing: border-box;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

}

.card {
  width: calc(100% / 3 - 20px);
  padding: 20px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: transform 0.3s ease;
  margin: 0 12px 20px 0;
  display: grid;
  grid-template-rows: 1fr ;
  grid-template-columns: 40px 1fr;
  align-items: center;
  &:hover {
    transform: scale(1.05);
  }

  .card-icon {
    font-size: 1.5em; /* Adjust this value to match the size of your h2 */
    float: left; /* This will make the icon float to the left of the title and button */
    margin: 10px; /* This will add some space between the icon and the title/button */
    grid-row: 1/3;
    grid-column: 1/2;
  }


    .card-title {
    margin-bottom: 10px;
    grid-row: 1;
    grid-column: 2;
  }

  .card-button {
    grid-row: 3;
    grid-column: 2;
    margin-right: 10px;
    padding: 10px;
    border: none;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #0056b3;
    }
  }
  


}
</style>
