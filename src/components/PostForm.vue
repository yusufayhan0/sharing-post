<template>
  <div class="postform">
    <form 
      @submit.prevent="click" 
      class="postform__container" 
      :class="{
        [$attrs.classContainer]: $attrs.classContainer,
        'shadow': flat
      }"
    >
      <textarea
        class="postform__textarea"
        rows="10"
        placeholder="Your text here"
        :value="modelValue"
        @input="model = $event.target.value"
      >
      </textarea>

      <div class="postform__actions">
        <div>
          <Attach 
            class="postform__actions--attach-icon icon-action"
            @click="fileEmit"
          />

          <img 
            :src="base64_image"
            @click="deleteImage" 
            class="postform__actions-preview" 
            title="delete" 
            :class="{action: is_image}"
          >

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
            @change="handleFileInput"
          />
        </div>

        <slot 
          name="actions" 
          :save="click"
        />

        <button 
          v-if="!hasActions"
          type="submit" 
          class="postform__actions-button"
        >
          SUBMIT
        </button>
      </div>
    </form>
  </div>
</template>

<script>

export default {
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    flat: {
      type: Boolean,
      default: true
    }
  },
  data(){
    return {
      base64_image: null,
      is_image: false, 
      model: '',
    }
  },
  computed: {
    hasActions() {
      return this.$slots.actions;
    }
  },
  watch: {
    model(val) {
      this.handleTextInput(val)
    },
  },
  methods: {
    click(){
      this.$emit('save')
      this.deleteImage()
    },
    handleTextInput(value) {
      this.$emit('input', value)
      this.$emit('update:modelValue', value)
    },
    fileEmit(){
      this.$refs.fileUpload.click()
    },
    async handleFileInput(file){
      if(file.target.files.length){
        this.base64_image = await this.toBase64(file.target.files[0])
        this.$emit('file', this.base64_image)
        this.is_image = true
        this.$refs.fileUpload.value = null;
      }
    },
    deleteImage(){
      this.is_image = false

      setTimeout(() => {
        this.base64_image = null
        this.$emit('file', this.base64_image)
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
    background: #FFFFFF 0% 0% no-repeat padding-box;
    border-radius: 5px;
    outline: none;
    border: none;

    &.shadow {
      box-shadow: 0px 3px 6px #00000029;
    }
  }

  &__textarea {
    width: 100%;
    height: 72px;
    outline: none;
    border: none;
    resize: none;
    font-family: $font-family;

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
      cursor: pointer;
      margin-left: 5px;

      &.action{
        width: 20px;
      }
    }

    &--attach-icon {
      stroke: $primary-2;
      stroke-width: .4;
      transition: 300ms all;
      width: 11px;
      height: 19px;

      &:hover {
        stroke: $primary-1;
      }
    }
  }
}
</style>