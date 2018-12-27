<template>
  <div>
    <icon-base
      width="30"
      height="30"
      icon-name="icon-analgesic"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-baby"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-brekets"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-card"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-forceps"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-implant"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-injection"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-inset-jaw"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-observation"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-open-mouth"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-palm-face"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-paradontit"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-point"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-root-canal"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-survey"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-tablets"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-tooth-bacteria"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-tooth-bill"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-tooth-bottle"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-tooth-bottom"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-tooth-calendar"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-tooth-card"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-tooth-clean"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-tooth-corons"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-tooth-cracked"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-tooth-drop"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-tooth-extraction"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-tooth-health"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-tooth-ice"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-tooth-info"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-tooth-inspected"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-tooth-locked"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-tooth-pain"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-tooth-point"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-tooth-protected"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-tooth-renew"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-tooth-settings"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-tooth-small"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-tooth-star"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-tooth-sun"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-tooth-tablet"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-tooth-treated"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-tooth-tree"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-tooth-wash"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-tooth-wings"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-tooth-world"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-toggle-bottom"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-toggle-top"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-toggle-bottom"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-tooth-hand-care"/>

    <icon-base
      width="30"
      height="30"
      icon-name="icon-tooth-carries"/>
  </div>

</template>
<script>
  import {
    IconBase,
  } from '@/components';

  export default {
    components: {
      IconBase,
    },
    data() {
      return {
        tableData: [
          {
            id: 1,
            name: 'Dakota Rice',
            salary: '$36.738',
            country: 'Niger',
            city: 'Oud-Turnhout',
            icon1: 'person',
            icon2: 'edit',
            icon3: 'close',
          },
          {
            id: 2,
            name: 'Minerva Hooper',
            salary: '$23,789',
            country: 'Curaçao',
            city: 'Sinaai-Waas',
            icon1: 'person',
            icon2: 'edit',
            icon3: 'close',
          },
          {
            id: 3,
            name: 'Sage Rodriguez',
            salary: '$56,142',
            country: 'Netherlands',
            city: 'Baileux',
            icon1: 'person',
            icon2: 'edit',
            icon3: 'close',
          },
          {
            id: 4,
            name: 'Philip Chaney',
            salary: '$38,735',
            country: 'Korea, South',
            city: 'Overland Park',
            icon1: 'person',
            icon2: 'edit',
            icon3: 'close',
          },
          {
            id: 5,
            name: 'Doris Greene',
            salary: '$63,542',
            country: 'Malawi',
            city: 'Feldkirchen in Kärnten',
            icon1: 'person',
            icon2: 'edit',
            icon3: 'close',
          },
        ],
      };
    },
    computed: {
      shoppingTotal() {
        return this.shoppingCartTable.reduce(
          (accumulator, current) => accumulator + current.amount,
          0,
        );
      },
    },
    methods: {
      getClass(item, id) {
        let classes = '';
        switch (item) {
        case 'person': {
          classes = 'md-info';
          break;
        }
        case 'edit': {
          classes = 'md-success';
          break;
        }
        case 'close': {
          classes = 'md-danger';
          break;
        }
        default:
          // do nothing
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
        default:
          // do nothing
        }
        return classes;
      },
      getAlignClasses: ({ id }) => ({
        'text-right': id,
      }),
      increaseQuantity(item) {
        const nitem = item;
        nitem.qty += 1;
        this.computeAmount(nitem);
      },
      decreaseQuantity(item) {
        if (item.qty > 1) {
          const nitem = item;
          nitem.qty -= 1;
          this.computeAmount(nitem);
        }
      },
      computeAmount(item) {
        const nitem = item;
        nitem.amount = nitem.qty * nitem.price;
      },
    },
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
