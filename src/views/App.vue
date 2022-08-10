<template>
  <main class="page-content">
    <section class="container">
      <div class="post-content">
        <PostForm 
          v-model="text"
          classContainer="post-form"
          v-model:file="base64_image"
          @save="post"
        />
        <PostList />
      </div>
    </section>
  </main>
</template>

<script>
export default {
  name: "App",
  data(){
    return {
      text: '',
      base64_image: ''
    }
  },
  methods: {
    post(){
      const model = {
        "userId": 1,
        "img": this.base64_image,
        "text": this.text,
        "like": 0,
        "dislike": 0,
        "created_at": new Date()
      }
      this.$axios.post('posts', model)
      .then(() => {
        this.$bus.emit("update-post-list")
        this.text = ""
      })
      .catch(err => {
        console.log("error", err.response)
      })
    },
  },
};
</script>

<style lang="scss">
.post-content {
  width: 420px;
  margin: 0 auto;

  .post-form{
    padding: 30px 30px 40px 30px;
  }
}
</style>
