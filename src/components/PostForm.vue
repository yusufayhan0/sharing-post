<template>
  <div class="postform">
    <form @submit.prevent="post" class="postform__container">
      <textarea
        class="postform__textarea"
        name=""
        id=""
        cols="30"
        rows="10"
        placeholder="Your text here"
        v-model="text"
      >
      </textarea>

      <div class="postform__actions">
        <div>
          <VueFeather
            type="paperclip"
            stroke="#C1C8CE"
            stroke-width="1.5"
            class="postform__actions-icon action-attach icon-action"
            size="20"
            @click="fileEmit"
          />
          <img :src="base64_image" @click="deleteImage" class="postform__actions-preview" :class="{action: is_image}" alt="">
          <VueFeather
            type="smile"
            stroke="#C1C8CE"
            stroke-width="1.5"
            class="postform__actions-icon action-smile icon-action"
            size="20"
          />
          <input 
            type="file" 
            class="postform__actions--file-upload" 
            ref="fileUpload" 
            accept="image/*" 
            @change="fileUpload"
          />
        </div>

        <button 
          type="submit" 
          class="postform__actions-button">
          SUBMIT
        </button>
      </div>
    </form>
  </div>
</template>

<script>

export default {
  data(){
    return {
      base64_image: null,
      is_image: false, 
      text: '',
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
    fileEmit(){
      this.$refs.fileUpload.click()
    },
    async fileUpload(file){
      if(file.target.files.length){
        this.base64_image = await this.toBase64(file.target.files[0])
        this.is_image = true
        this.$refs.fileUpload.value = null;
      }
    },
    toBase64(file){
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      })
    },
    deleteImage(){
      this.is_image = false

      setTimeout(() => {
        this.base64_image = null
      }, 500);
    }
  }
};
</script>

<style lang="scss">
.postform {
  display: flex;
  justify-content: center;

  &__container {
    width: 100%;
    max-width: 1000px;
    display: inline-block;
    height: 178px;
    background: #FFFFFF 0% 0% no-repeat padding-box;
    box-shadow: 0px 3px 6px #00000029;
    border-radius: 5px;
    outline: none;
    border: none;
    padding: 30px 30px 40px 30px;
  }

  &__textarea {
    width: 100%;
    height: 72px;
    outline: none;
    border: none;
    resize: none;

    &::placeholder {
      color: #C1C8CE;
      font-size: 14px;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;

    &-icon {
      margin-right: 5px;

      &.action-smile {
        margin-left: 13.5px;
      }
    }

    &-button {
      background: #9B59B6 0% 0% no-repeat padding-box;
      box-shadow: 0px 3px 6px #8E44AD29;
      border-radius: 5px;
      padding: 10px 25px;
      border: none;
      color: white;
      font-size: 14px;
      cursor: pointer;
      font-weight: 500;
    }

    &--file-upload {
      display: none;
    }

    &-preview {
      width: 0px;
      height: 20px;
      transition: 500ms all;
      border-radius: 3px;

      &.action{
        width: 20px;
      }
    }
  }
}
</style>