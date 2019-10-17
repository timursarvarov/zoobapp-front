import { LOCATIONS } from '@/constants';

// добваить filterAvailable в атрибуты для фильтрации

export default function filterItems(NoNeedGroupilized, items = []) {
    let filteredItems = [];
    if (NoNeedGroupilized) {
        items.forEach(item => {
            filteredItems[item.ID] = {
                ...LOCATIONS[item.templateID],
                ...item
            };
        });
        return filteredItems;
    }
    items.forEach(item => {
        let groupIndex = filteredItems.findIndex(el => el.code === item.categoryCode);
        // если группа нозоологии не создана
        if (groupIndex === -1) {
            groupIndex =
                filteredItems.push({
                    code: item.categoryCode,
                    title: item.categoryTitle,
                    codes: []
                }) - 1;
            filteredItems[groupIndex].codes.push({
                ...LOCATIONS[item.templateID],
                ...item
            });
        } else {
            // if (item.available && !filterAvailable) {
            filteredItems[groupIndex].codes.push({
                ...LOCATIONS[item.templateID],
                ...item
            });
            // }
        }
    });
    filteredItems = filteredItems.filter(el => el.codes.length !== 0);
    return filteredItems;
}
