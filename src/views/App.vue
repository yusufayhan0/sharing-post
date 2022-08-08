<template>
  <main class="page-content">
    <section class="container">
      <div class="post-content">
        <PostForm />
        <PostList />
      </div>
    </section>
  </main>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
.post-content {
  width: 420px;
  margin: 0 auto;
}
</style>
