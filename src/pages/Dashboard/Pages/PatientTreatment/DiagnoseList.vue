<template>
   <md-table  md-sort="Size"  v-model="shoppingCartTable" class="table-shopping">
       <md-table-toolbar>
        <h1 class="md-title">Users</h1>
      </md-table-toolbar>
            <md-table-row slot="md-table-row" slot-scope="{ item }">
              <md-table-cell md-label="">
                <div class="img-container">
                  <img :src="item.image" alt="products"/>
                </div>
              </md-table-cell>
              <md-table-cell md-label="Product" class="td-name">
                <a href="#jacket">{{ item.product }}</a>
                <br/>
                <small>{{ item.category }}</small>
              </md-table-cell>
              <md-table-cell md-label="Color">{{ item.color }}</md-table-cell>
              <md-table-cell md-label="Size">{{ item.size }}</md-table-cell>
              <md-table-cell md-label="Price" class="td-number">
                <small>€</small>
                {{ item.price }}
              </md-table-cell>
              <md-table-cell md-label="Qty" class="td-number">
                {{ item.qty }}
                <div class="md-group">
                  <md-button class="md-round md-info md-just-icon" @click.native="increaseQuantity(item)"><md-icon>add</md-icon></md-button>
                  <md-button class="md-round md-info md-just-icon" @click.native="decreaseQuantity(item)"><md-icon>remove</md-icon></md-button>
                </div>
              </md-table-cell>
              <md-table-cell md-label="Amount" class="td-number">
                <small>€</small>
                {{ item.amount }}
              </md-table-cell>
              <md-table-cell>
                <md-button class="md-just-icon md-round md-simple"><md-icon>close</md-icon></md-button>
              </md-table-cell>
            </md-table-row>
          </md-table>
</template>
<script>
export default {
  data() {
    return {
      shoppingCartTable: [
        {
          image: "./img/product1.jpg",
          product: "Spring Jacket",
          category: "by Dolce&Gabbana",
          color: "Red",
          size: "M",
          price: 549,
          qty: 1,
          amount: 549
        },
        {
          image: "./img/product2.jpg",
          product: "Short Pants",
          category: "by Gucci",
          color: "Purple",
          size: "M",
          price: 499,
          qty: 2,
          amount: 998
        },
        {
          image: "./img/product3.jpg",
          product: "Pencil Skirt",
          category: "by Valentino",
          color: "Red",
          size: "M",
          price: 799,
          qty: 1,
          amount: 799
        }
      ]
    };
  },
  computed: {
    shoppingTotal() {
      return this.shoppingCartTable.reduce((accumulator, current) => {
        return accumulator + current.amount;
      }, 0);
    }
  },
  methods: {
    getClass: function(item, id) {
      let classes = "";
      switch (item) {
        case "person": {
          classes = "md-info";
          break;
        }
        case "edit": {
          classes = "md-success";
          break;
        }
        case "close": {
          classes = "md-danger";
          break;
        }
      }
      switch (id) {
        case 1:
        case 5: {
          break;
        }
        case 2:
        case 4: {
          classes = `${classes} md-round`;
          break;
        }
        case 3: {
          classes = `${classes} md-simple`;
          break;
        }
      }
      return classes;
    },
    getAlignClasses: ({ id }) => ({
      "text-right": id
    }),
    increaseQuantity(item) {
      item.qty++;
      this.computeAmount(item);
    },
    decreaseQuantity(item) {
      if (item.qty > 1) {
        item.qty--;
        this.computeAmount(item);
      }
    },
    computeAmount(item) {
      item.amount = item.qty * item.price;
    }
  }
};
</script>
<style lang="scss" scoped>
.text-right /deep/ .md-table-cell-container {
  display: flex;
  justify-content: flex-end;
}
.md-table /deep/ .md-table-head:last-child {
  text-align: right;
}

.table-stats {
  display: flex;
  align-items: center;
  text-align: right;
  flex-flow: row wrap;

  .td-price .td-total {
    display: inline-flex;
    font-weight: 500;
    font-size: 1.0625rem;
    margin-right: 50px;
  }

  &.table-striped .td-price {
    border-bottom: 0;
  }

  .td-price {
    font-size: 26px;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
  }

  .td-price,
  > div {
    flex: 0 0 100%;
    padding: 12px 8px;
  }
}

.table-shopping /deep/ .md-table-head:nth-child(5),
.table-shopping /deep/ .md-table-head:nth-child(7),
.table-shopping /deep/ .md-table-head:nth-child(6) {
  text-align: right;
}
</style>
