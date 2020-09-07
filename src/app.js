import 'intl';
import 'intl/locale-data/jsonp/en';

export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
    },
  },
};

export function render(oldRender) {
  oldRender();
}
