<template>
   <md-table v-model="tableData">
            <md-table-row slot="md-table-row" slot-scope="{ item }">
              <md-table-cell md-label="#">{{ item.id }}</md-table-cell>
              <md-table-cell md-label="Name">{{ item.name }}</md-table-cell>
              <md-table-cell md-label="Country">{{ item.country }}</md-table-cell>
              <md-table-cell md-label="City">{{ item.city }}</md-table-cell>
              <md-table-cell md-label="Salary">{{ item.salary }}</md-table-cell>
              <md-table-cell md-label="Actions" :class="getAlignClasses(item)">
                <md-button class="md-just-icon" :class="getClass(item.icon1, item.id)"><md-icon>{{ item.icon1 }}</md-icon></md-button>
                <md-button class="md-just-icon" :class="getClass(item.icon2, item.id)"><md-icon>{{ item.icon2 }}</md-icon></md-button>
                <md-button class="md-just-icon" :class="getClass(item.icon3, item.id)"><md-icon>{{ item.icon3 }}</md-icon></md-button>
              </md-table-cell>
            </md-table-row>
          </md-table>
</template>
<script>
export default {
  data() {
    return {
      tableData: [
        {
          id: 1,
          name: "Dakota Rice",
          salary: "$36.738",
          country: "Niger",
          city: "Oud-Turnhout",
          icon1: "person",
          icon2: "edit",
          icon3: "close"
        },
        {
          id: 2,
          name: "Minerva Hooper",
          salary: "$23,789",
          country: "Curaçao",
          city: "Sinaai-Waas",
          icon1: "person",
          icon2: "edit",
          icon3: "close"
        },
        {
          id: 3,
          name: "Sage Rodriguez",
          salary: "$56,142",
          country: "Netherlands",
          city: "Baileux",
          icon1: "person",
          icon2: "edit",
          icon3: "close"
        },
        {
          id: 4,
          name: "Philip Chaney",
          salary: "$38,735",
          country: "Korea, South",
          city: "Overland Park",
          icon1: "person",
          icon2: "edit",
          icon3: "close"
        },
        {
          id: 5,
          name: "Doris Greene",
          salary: "$63,542",
          country: "Malawi",
          city: "Feldkirchen in Kärnten",
          icon1: "person",
          icon2: "edit",
          icon3: "close"
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
