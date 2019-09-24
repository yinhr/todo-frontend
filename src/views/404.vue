<template>
  <div class="bg-gray-100 min-h-screen flex flex-col">
    <Header></Header>
    <div class="flex-grow text-center p-16">
      <h1 class="mb-4 text-5xl font-black">404 Not Found</h1>
      <p>お探しのページは見つかりませんでした</p>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
export default {
  title: 'エラー',
  name: 'home',
  components: {
    Header,
    Footer
  }
}
</script>
