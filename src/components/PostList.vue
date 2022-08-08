<template>
  <div class="postlist">
    <PostItem v-for="post in posts" :post="post" :key="post.id" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      posts: [],
    };
  },
  created(){
    this.loadData()

    this.$bus.on("update-post-list", ()=> {
      this.loadData()
    })
  },
  methods: {
    loadData(){
      this.$axios.get(`posts?&_expand=user&_sort=created_at&_order=desc`)
      .then((res) => {
        this.posts = res.data
      })
    }
  },
  unmounted(){
    this.$bus.off('update-post-list')
  }
};
</script>

<style lang="scss">
.postlist {
  margin-top: 20px;
}
</style>