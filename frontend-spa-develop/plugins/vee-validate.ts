import Vue from 'vue';
import {
  required, email, alpha_num, min, max,
  confirmed, length, numeric, min_value,
  max_value, required_if, image, size, ext,
  integer, between
} from 'vee-validate/dist/rules';
import en from 'vee-validate/dist/locale/en.json';
import vi from 'vee-validate/dist/locale/vi.json';
import { ValidationProvider, ValidationObserver, localize, extend } from 'vee-validate';
import moment from 'moment';

extend('required_if', required_if);
extend('required', required);
extend('email', email);
extend('numeric', numeric);
extend('alpha_num', alpha_num);
extend('min', min);
extend('max', max);
extend('confirmed', confirmed);
extend('length', length);
extend('integer', integer);
extend('min_value', min_value);
extend('max_value', max_value);
extend('image', image);
extend('size', size);
extend('ext', ext);
extend('dateBeforeOrEqual', {
  validate: function(dateFrom, { dateTo }: any) : boolean {
    if (dateTo) {
      const dateFromToObj = moment(dateFrom, 'YYYY/MM/DD');
      const dateToObj = moment(dateTo, 'YYYY/MM/DD');

      return moment(dateFromToObj).isSameOrBefore(dateToObj);
    }

    return true;
  },
  message: function() : string {
    return '[From date] should be less or equal than [To date]';
  },
  params: [{ name: 'dateTo', isTarget: true }]
});

extend('floatNum', {
  validate: function(value: any) : boolean {
    if ((value === undefined) || (value === null)) {
      return false;
    }
    if (typeof value === 'number') {
      return true;
    }
    return !isNaN(value - 0);
  },
  message: function() : string {
    return `This field must be numeric`;
  }
});

extend('dateBeforeToday', {
  validate: function(date : string) : boolean {
    const today = moment().format('YYYY/MM/DD');
    return moment(date).isSameOrBefore(today);
  },
  message: function() : string {
    const today = moment().format('YYYY/MM/DD');
    return 'Date should less or equal to ' + today;
  }
});

extend('workingAge', {
  validate: function(date : string) : boolean {
    const currentYear = moment().year();
    const birthYear = moment(date).year();
    return currentYear - birthYear >= 18;
  },
  message: function() : string {
    return 'You \'re not in range of working age';
  }
});

extend('eval_required', {
  ...required,
  message: function() : string {
    return 'This field is required';
  }
});

extend('eval_between', {
  ...between,
  message: function(field, params) : string {
    const min = params && params.min;
    const max = params && params.max;

    return 'This field must be between ' + min + ' and ' + max;
  }
});

extend('eval_numeric', {
  ...numeric,
  message: function() : string {
    return 'This field can only contain numeric characters';
  }
});

extend('timeBeforeOrEqual', {
  validate: function(from_timeh_leave, { to_timeh_leave }: any) : boolean {
    if (to_timeh_leave) {
      return from_timeh_leave * 60 <= to_timeh_leave * 60;
    }
    return true;
  },
  message: function() : string {
    return 'Time from should be less than time to';
  },
  params: [{ name: 'to_timeh_leave', isTarget: true }]
});

extend('dateBeforeCurrentDate', {
  validate: function(dateFrom, { dateTo }: any) : boolean {
    if (dateTo || dateFrom) {
      const dateFromToObj = moment(dateFrom, 'YYYY/MM/DD');
      const dateToObj = moment(dateTo, 'YYYY/MM/DD');
      const currentDate = new Date();
      const yesterDayDate = currentDate.setDate(currentDate.getDate() - 1);
      return !(moment(dateFromToObj).isSameOrBefore(yesterDayDate) || moment(dateToObj).isSameOrBefore(yesterDayDate));
    }

    return true;
  },
  message: function() : string {
    return 'Cannot select date in the past';
  },
  params: [{ name: 'dateTo', isTarget: true }]
});

extend('normalDay', {
  validate: function(date : Date) : boolean {
    if (date) {
      if (date.getDay() === 0 || date.getDay() === 6) {
        return false;
      }
    }
    return true;
  },
  message: function() : string {
    return 'Cannot choose weekends';
  }
});

extend('confirmPassword', {
  validate: function(password, { passwordCofirm }: any) : boolean {
    if (password !== passwordCofirm) {
      return false;
    }

    return true;
  },
  message: function() : string {
    return `Those passwords didn't match. Try again.`;
  },
  params: [{ name: 'passwordCofirm', isTarget: true }]
});

localize('en', en);
localize('vi', vi);
localize({
  ja: {
    messages: {
      dateBeforeOrEqual: '「開始日」は「終了日」以下である必要があります',
      floatNum: 'この項目は数値でなければなりません。',
      dateBeforeToday: '日付は今日以下にする必要があります。',
      workingAge: '労働年齢の範囲内ではありません。',
      eval_numeric: 'この項目はアルファベットと英数字のみ使用できます。',
      timeBeforeOrEqual: '「開始時間」は「終了時間」以下である必要があります。',
      dateBeforeCurrentDate: '過去の日付は選択できません。',
      normalDay: '週末を洗濯できません。',
      eval_required: 'この項目は必須です。',
      eval_between: 'この項目は0から100の間でなければなりません。',
      confirmPassword: 'それらのパスワードは一致しませんでした。再試行。'
    }
  },
  vi: {
    messages: {
      dateBeforeOrEqual: '[Ngày chọn] phải nhỏ hơn [Ngày đến]',
      floatNum: 'Trường này phải là số.',
      dateBeforeToday: 'Ngày chọn phải nhỏ hơn hoặc bằng ngày hôm nay.',
      workingAge: 'Không trong độ tuổi làm việc',
      eval_numeric: 'Mục này chỉ được sử dụng chữ cái hoặc số.',
      timeBeforeOrEqual: '[Ngày bắt đầu] phải nhỏ hơn [Ngày kết thúc]',
      dateBeforeCurrentDate: 'Không thể chọn ngày quá khứ.',
      normalDay: 'Không thể chọn ngày cuối tuần.',
      eval_required: 'Trường này là bắt buộc',
      eval_between: 'Trường này phải trong khoảng từ 0 đến 100',
      confirmPassword: 'Mật khẩu không khớp. Hãy nhập lại.'
    }
  },
  en: {
    messages: {
      dateBeforeOrEqual: '[From date] should be less or equal than [To date]'
    }
  }
});
// Use the provider immediately
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);
