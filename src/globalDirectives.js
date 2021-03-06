import { directive as vClickOutside } from 'vue-clickaway';
import Ripple from 'vue-ripple-directive';

Ripple.color = 'rgba(0, 0, 0, 0.1)';

/**
 * You can register global directives here and use them as a plugin in your main Vue instance
 */

const GlobalDirectives = {
    install(Vue) {
        Vue.directive('click-outside', vClickOutside);
        Vue.directive('ripple', Ripple);
        Vue.directive('focus', {
            // Когда привязанный элемент вставлен в DOM...
            inserted: function(el) {
                // Переключаем фокус на элемент
                el.focus();
            }
        });
    }
};

export default GlobalDirectives;
