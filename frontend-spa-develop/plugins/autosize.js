import Vue from 'vue';
import autosize from 'autosize/dist/autosize';

Vue.directive('autosize', {
  bind: function(el) {
    autosize(el);
  },

  update: function(el) {
    autosize.update(el);
  },

  unbind: function(el) {
    autosize.destroy(el);
  }
});
