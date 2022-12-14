<template>
  <div class="post">
    <div class="post__conteiner">
      <div class="post__content">
        <img class="post__content--profile-image" src="@/assets/img/profile.jpg" alt="" />
        <div class="post__update-form">
          <!-- eslint-disable-next-line vue/no-deprecated-filter -->
          <div class="post__content-date">{{ created_at }}</div>
          <div class="post__content-text">
            <template v-if="!edit">
              <span> {{ userFullName(post) }} </span>
              {{ post.text }}

              <img class="post__content-img" :src="post.img" alt="">
            </template>

            <PostForm 
              v-else
              v-model="text"
              @file="file"
              @save="updatePost(post.id)"
              :flat="false"
            >
              <template #actions="{ save }">
                <div>
                  <VueFeather
                    type="x"
                    stroke="#C1C8CE"
                    stroke-width="1.8"
                    size="20"
                    class="icon-action post__update--close-icon"
                    title="close"
                    @click="edit = false"
                  />

                  <VueFeather
                    type="check"
                    stroke="#C1C8CE"
                    stroke-width="1.8"
                    size="20"
                    class="icon-action"
                    title="update"
                    @click="save"
                  />
                </div>
              </template>
            </PostForm>
          </div>
        </div>
      </div>

      <div class="post__actions">
        <div class="post__actions-like-dislike">
          <div class="post__actions-like" v-if="!is_delete">
            <VueFeather
              type="thumbs-up"
              stroke="#C1C8CE"
              stroke-width="1.8"
              size="20"
              class="icon-action"
              @click="likePost(post.id)"
              title="like"
            />

            {{ post.like }}
          </div>
          
          <div class="post__actions-dislike" v-if="!is_delete">
            <VueFeather
              type="thumbs-down"
              stroke="#C1C8CE"
              stroke-width="1.8"
              size="20"
              class="icon-action"
              @click="disLikePost(post.id)"
              title="dislike"
            />

            {{ post.dislike }}
          </div>
        </div>
        
        <div class="post__actions-manage">
          <VueFeather
            v-if="!is_delete"
            type="edit-3"
            stroke="#C1C8CE"
            stroke-width="1.8"
            size="20"
            class="icon-action"
            @click="editPost(post.id)"
            title="edit"
          />

          <VueFeather
            type="trash-2"
            stroke="#C1C8CE"
            stroke-width="1.8"
            size="20"
            class="icon-action post__actions-manage--delete-icon"
            :class="{active: !is_delete}"
            @click="deletePost(post.id)"
            title="delete"
          />

          <PostUndo 
            class="post__actions-manage--undo-icon icon-action"
            :class="{active: is_delete}"
            @click="deleteUndoPost(post.id)"
          />
        </div>
      </div>
    </div>

    <div class="post--undo-line" :class="{active: is_delete}"></div>
  </div>
</template>

<script>
import dayjs from "dayjs"

export default {
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  data(){
    return {
      edit: false,
      text: '',
      is_delete: false,
      delete_post_time: null,
      base64_image: null,
      is_image: false, 
      undo_time: 10000
    }
  },
  methods: {
    file(base64image){
      this.base64_image = base64image
    },
    userFullName({ user }){
      return `${user.first_name} ${user.last_name}`
    },
    deleteUndoPost(){
      this.is_delete = false
      clearTimeout(this.delete_post_time)
    },
    deletePost(post_id){
      this.is_delete = true
      this.delete_post_time = setTimeout(() => {
        if(this.is_delete){
          this.deletePostConfim(post_id)
          this.is_delete = false
        }
      }, this.undo_time);
    },
    deletePostConfim(post_id){
      this.$axios.delete(`posts/${post_id}`)
      .then(() => {
        this.emitLoadPostList()
      })
    },
    updatePost(post_id){
      this.$axios.put(`posts/${post_id}`, {
        ...this.post,
        text: this.text,
        img: this.base64_image
      })
      .then(() => {
        this.emitLoadPostList()
        this.edit = false
        this.base64_image = ''
      })
    },
    editPost(){
      this.edit = true
      this.text = this.post.text
    },
    likePost(post_id){
      this.$axios.put(`posts/${post_id}`, {
        ...this.post,
        like: this.post.like + 1
      })
      .then(() => {
        this.emitLoadPostList()
      })
    },
    disLikePost(post_id){
      this.$axios.put(`posts/${post_id}`, {
        ...this.post,
        dislike: this.post.dislike + 1
      })
      .then(() => {
        this.emitLoadPostList()
      })
    },
    emitLoadPostList(){
      this.$bus.emit("update-post-list")
    }
  },
  computed: {
    created_at(){
      return dayjs(this.post.created_at).format('DD.MM.YYYY - HH:mm')
    },
    undoTime(){
      return `${this.undo_time}ms`
    }
  }
};
</script>

<style lang="scss">
.post {
  margin-bottom: 10px;
  position: relative;

  &__update--close-icon {
    margin-right: 10px;
  }

  &__conteiner {
    background: #FFFFFF 0% 0% no-repeat padding-box;
    box-shadow: 0px 3px 6px #00000029;
    border-radius: 5px;
  }

  &__update-form {
    width: 100%;
  }

  &--undo-line {
    position: absolute;
    width: 0%;
    height: 3px;
    bottom: 0px;
    background-color: $primary-1;
    transition: 0ms all linear;
    visibility: hidden;

    &.active {
      width: 100%;
      visibility: visible;
      transition: v-bind(undoTime) all linear;
    }
  }

  &__content {
    display: flex;
    padding: 20px 20px 8px 20px;

    &--profile-image {
      width: 40px;
      height: 40px;
      margin-right: 10px;
      margin-top: 5px;
    }

    &-date {
      color: #99A4AE;
      font-size: 8px;
    }

    &-text {
      font-size: 14px;
      letter-spacing: 0px;

      span {
        color: $primary-1;
      }
    }

    &-img {
      width: 100%;
      margin-top: 15px;
      border-radius: 3px;
    }
  }

  &__actions {
    display: flex;
    justify-content: space-between;
    border-top: 1px solid;
    border-color: color(.6, $primary-2);
    padding: 12px 20px;

    &-like-dislike {
      display: flex;
      color: $primary-2;
    }

    &-like {
      display: flex;
      align-items: center;
      margin-right: 20px;
      column-gap: 4.5px;
    }

    &-dislike {
      display: flex;
      align-items: center;
      column-gap: 4.5px;
    }

    &--close-icon {
      margin-right: 13.5px;
    }

    &-manage {
      position: relative;
      display: flex;
      column-gap: 10px;

      &--delete-icon {
        visibility: hidden;
        transition: 300ms all;
        opacity: 0;

        &.active {
          visibility: visible;
          opacity: 1;
        }
      }

      &--undo-icon {
        stroke: $primary-2;
        transition: 300ms all;
        visibility: hidden;
        position: absolute;
        right: 0px;
        opacity: 0;

        &.active {
          visibility: visible;
          opacity: 1;
        }

        &:hover {
          stroke: $primary-1;
        }
      }
    }
  }
}
</style>