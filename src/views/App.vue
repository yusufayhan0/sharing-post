<template>
  <main class="page-content">
    <section class="container">
      <div class="post-content">
        <PostForm 
          v-model="text"
          classContainer="post-form"
          @file="file"
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
  mounted(){
    document.title = "Sharing Post"
  },
  methods: {
    file(base64image){
      this.base64_image = base64image
    },
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
        this.base64_image = ""
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
  max-width: 420px;
  width: 100%;
  margin: 0 auto;

  .post-form{
    padding: 30px 30px 40px 30px;
  }
}
</style>
