<template>
  <div>
    <h5 class="info-text"> Let's start with the basic information (with validation)</h5>
<jaw></jaw>

  </div>
</template>
<script>
import { SlideYDownTransition } from "vue2-transitions";
import Jaw from "./Jaw";
export default {
  components: {
    SlideYDownTransition,
    Jaw
  },
  props: {
    avatar: {
      type: String,
      default: "./img/default-avatar.png"
    }
  },
  data() {
    return {
      image: "",
      single: null,
      firstName: "",
      lastName: "",
      email: "",
      touched: {
        firstName: false,
        lastName: false
      },
      modelValidations: {
        firstName: {
          required: true,
          min: 5
        },
        lastName: {
          required: true,
          min: 5
        },
        email: {
          required: true,
          email: true
        }
      }
    };
  },
  methods: {
    handlePreview(file) {
      this.model.imageUrl = URL.createObjectURL(file.raw);
    },
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    validate() {
      return this.$validator.validateAll().then(res => {
        this.$emit("on-validated", res);
        return res;
      });
    },
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.createImage(files[0]);
    },
    createImage(file) {
      var reader = new FileReader();
      var vm = this;

      reader.onload = e => {
        vm.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  },
  watch: {
    firstName() {
      this.touched.firstName = true;
    },
    lastName() {
      this.touched.lastName = true;
    },
    email() {
      this.touched.email = true;
    }
  }
};
</script>
<style>
</style>
