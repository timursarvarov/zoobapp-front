import { LOCATIONS } from '@/constants';

export default function filterItems(items = [], filterAvailable) {
    let filteredItems = [];
    items.forEach((item) => {
        let groupIndex = filteredItems.findIndex(
            el => el.code === item.categoryCode,
        );
        if (groupIndex === -1) {
            groupIndex = filteredItems.push({
                code: item.categoryCode,
                title: item.title,
                codes: [],
            }) - 1;
        }else{
            // if (item.available && !filterAvailable) {
                filteredItems[groupIndex].codes.push({
                    ...LOCATIONS[item.templateID],
                    ...item,
                });
            // }
        }
    });
    filteredItems = filteredItems.filter(el => el.codes.length !== 0);
    return filteredItems;
};