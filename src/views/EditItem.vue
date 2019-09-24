<template>
  <div class="home bg-gray-100">
    <Header></Header>
    <EditTodo :todoid="todoid"></EditTodo>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import EditTodo from '@/components/Edit.vue'
export default {
  title: '編集',
  components: {
    Header,
    EditTodo,
    Footer
  },
  computed: {
    todoid: function() {
      return this.$route.params.id
    }
  }
}
</script>
