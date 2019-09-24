<template>
  <div class="home bg-gray-100">
    <Header></Header>
    <NewTodo></NewTodo>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import NewTodo from '@/components/New.vue'
export default {
  title: '新規作成',
  components: {
    Header,
    NewTodo,
    Footer
  }
}
</script>
