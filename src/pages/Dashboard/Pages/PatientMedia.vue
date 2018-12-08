<template>
  <div class="content">
    <div class="md-layout">
        <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-33">
          <product-card
            header-animation="true">
            <img class="img" slot="imageHeader" :src="product1">
            <md-icon slot="fixed-button">build</md-icon>
            <template slot="first-button">
              <md-icon>art_track</md-icon>
              <md-tooltip md-direction="bottom">View</md-tooltip>
            </template>
            <template slot="second-button">
              <md-icon >edit</md-icon>
              <md-tooltip md-direction="bottom">Edit</md-tooltip>
            </template>
            <template slot="third-button">
              <md-icon >close</md-icon>
              <md-tooltip md-direction="bottom">Remove</md-tooltip>
            </template>
            <h4 slot="title" class="title">
              <a href="#pablo">Cozy 5 Stars Apartment</a>
            </h4>
            <div slot="description" class="card-description">
              The place is close to Barceloneta Beach and bus stop just 2 min by walk and near to "Naviglio" where you can enjoy the main night life in Barcelona.
            </div>
            <template slot="footer">
              <div class="price">
                <h4>$899/night</h4>
              </div>
              <div class="stats">
                <p class="category">
                  <md-icon>place</md-icon>
                  Barcelona, Spain
                </p>
              </div>
            </template>
          </product-card>
        </div>
        <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-33">
          <product-card
            header-animation="true">
            <img class="img" slot="imageHeader" :src="product2">
            <md-icon slot="fixed-button">build</md-icon>
            <template slot="first-button">
              <md-icon>art_track</md-icon>
              <md-tooltip md-direction="bottom">View</md-tooltip>
            </template>
            <template slot="second-button">
              <md-icon >edit</md-icon>
              <md-tooltip md-direction="bottom">Edit</md-tooltip>
            </template>
            <template slot="third-button">
              <md-icon >close</md-icon>
              <md-tooltip md-direction="bottom">Remove</md-tooltip>
            </template>
            <h4 slot="title" class="title">
              <a href="#pablo">Office Studio</a>
            </h4>
            <div slot="description" class="card-description">
              The place is close to Metro Station and bus stop just 2 min by walk and near to "Naviglio" where you can enjoy the night life in London, UK.
            </div>
            <template slot="footer">
              <div class="price">
                <h4>$1.119/night</h4>
              </div>
              <div class="stats">
                <p class="category">
                  <md-icon>place</md-icon>
                  London, UK
                </p>
              </div>
            </template>
          </product-card>
        </div>
        <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-33">
          <product-card
            header-animation="true">
            <img class="img" slot="imageHeader" :src="product3">
            <md-icon slot="fixed-button">build</md-icon>
            <template slot="first-button">
              <md-icon>art_track</md-icon>
              <md-tooltip md-direction="bottom">View</md-tooltip>
            </template>
            <template slot="second-button">
              <md-icon >edit</md-icon>
              <md-tooltip md-direction="bottom">Edit</md-tooltip>
            </template>
            <template slot="third-button">
              <md-icon >close</md-icon>
              <md-tooltip md-direction="bottom">Remove</md-tooltip>
            </template>
            <h4 slot="title" class="title">
              <a href="#pablo">Beautiful Castle</a>
            </h4>
            <div slot="description" class="card-description">
              The place is close to Metro Station and bus stop just 2 min by walk and near to "Naviglio" where you can enjoy the main night life in Milan.
            </div>
            <template slot="footer">
              <div class="price">
                <h4>$459/night</h4>
              </div>
              <div class="stats">
                <p class="category">
                  <md-icon>place</md-icon>
                    Milan, Italy
                </p>
              </div>
            </template>
          </product-card>
        </div>
    </div>
    <div class="md-layout">
        <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-33">
          <product-card
            header-animation="true">
            <img class="img" slot="imageHeader" :src="product1">
            <md-icon slot="fixed-button">build</md-icon>
            <template slot="first-button">
              <md-icon>art_track</md-icon>
              <md-tooltip md-direction="bottom">View</md-tooltip>
            </template>
            <template slot="second-button">
              <md-icon >edit</md-icon>
              <md-tooltip md-direction="bottom">Edit</md-tooltip>
            </template>
            <template slot="third-button">
              <md-icon >close</md-icon>
              <md-tooltip md-direction="bottom">Remove</md-tooltip>
            </template>
            <h4 slot="title" class="title">
              <a href="#pablo">Cozy 5 Stars Apartment</a>
            </h4>
            <div slot="description" class="card-description">
              The place is close to Barceloneta Beach and bus stop just 2 min by walk and near to "Naviglio" where you can enjoy the main night life in Barcelona.
            </div>
            <template slot="footer">
              <div class="price">
                <h4>$899/night</h4>
              </div>
              <div class="stats">
                <p class="category">
                  <md-icon>place</md-icon>
                  Barcelona, Spain
                </p>
              </div>
            </template>
          </product-card>
        </div>
        <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-33">
          <product-card
            header-animation="true">
            <img class="img" slot="imageHeader" :src="product2">
            <md-icon slot="fixed-button">build</md-icon>
            <template slot="first-button">
              <md-icon>art_track</md-icon>
              <md-tooltip md-direction="bottom">View</md-tooltip>
            </template>
            <template slot="second-button">
              <md-icon >edit</md-icon>
              <md-tooltip md-direction="bottom">Edit</md-tooltip>
            </template>
            <template slot="third-button">
              <md-icon >close</md-icon>
              <md-tooltip md-direction="bottom">Remove</md-tooltip>
            </template>
            <h4 slot="title" class="title">
              <a href="#pablo">Office Studio</a>
            </h4>
            <div slot="description" class="card-description">
              The place is close to Metro Station and bus stop just 2 min by walk and near to "Naviglio" where you can enjoy the night life in London, UK.
            </div>
            <template slot="footer">
              <div class="price">
                <h4>$1.119/night</h4>
              </div>
              <div class="stats">
                <p class="category">
                  <md-icon>place</md-icon>
                  London, UK
                </p>
              </div>
            </template>
          </product-card>
        </div>
        <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-33">
          <product-card
            header-animation="true">
            <img class="img" slot="imageHeader" :src="product3">
            <md-icon slot="fixed-button">build</md-icon>
            <template slot="first-button">
              <md-icon>art_track</md-icon>
              <md-tooltip md-direction="bottom">View</md-tooltip>
            </template>
            <template slot="second-button">
              <md-icon >edit</md-icon>
              <md-tooltip md-direction="bottom">Edit</md-tooltip>
            </template>
            <template slot="third-button">
              <md-icon >close</md-icon>
              <md-tooltip md-direction="bottom">Remove</md-tooltip>
            </template>
            <h4 slot="title" class="title">
              <a href="#pablo">Beautiful Castle</a>
            </h4>
            <div slot="description" class="card-description">
              The place is close to Metro Station and bus stop just 2 min by walk and near to "Naviglio" where you can enjoy the main night life in Milan.
            </div>
            <template slot="footer">
              <div class="price">
                <h4>$459/night</h4>
              </div>
              <div class="stats">
                <p class="category">
                  <md-icon>place</md-icon>
                    Milan, Italy
                </p>
              </div>
            </template>
          </product-card>
        </div>
    </div>
  </div>
</template>

<script>
import {
  ProductCard
} from "@/components";
export default {
  components: {
    ProductCard
  },
   data() {
    return {
      imageRegular: "",
      product1: "./img/card-2.jpg",
      product2: "./img/card-3.jpg",
      product3: "./img/card-1.jpg",
    }
  },
  props: {
    regularImg: {
      type: String,
      default: "./img/image_placeholder.jpg"
    },
    avatarImg: {
      type: String,
      default: "./img/placeholder.jpg"
    }
  },
  methods: {
  }
};
</script>
<style lang="scss">
.text-right {
  display: flex;
}
</style>
