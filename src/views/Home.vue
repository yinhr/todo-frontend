<template>
  <div class="home bg-gray-100">
    <Header :parentComponent="home"
       @orderByDeadline="orderByDeadline"
       @orderByCreatedDateDesc="orderByCreatedDateDesc"
       @orderByCreatedDateAsc="orderByCreatedDateAsc"
    ></Header>
    <ItemList ref="itemList"></ItemList>
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
  },
  methods: {
    orderByDeadline: function() {
      this.$refs.itemList.orderByDeadline()
    },
    orderByCreatedDateDesc: function() {
      this.$refs.itemList.orderByCreatedDateDesc()
    },
    orderByCreatedDateAsc: function() {
      this.$refs.itemList.orderByCreatedDateAsc()
    }
  }
}
</script>
