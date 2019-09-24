<template>
  <div class="home bg-gray-100">
    <Header :parentComponent="home"></Header>
    <ItemList></ItemList>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import ItemList from '@/components/ItemList.vue'
import Footer from '@/components/Footer.vue'
export default {
  title: 'Home',
  name: 'home',
  components: {
    Header,
    ItemList,
    Footer
  },
  data: function () {
    return {
      home: 'home'
    }
  }
}
</script>
