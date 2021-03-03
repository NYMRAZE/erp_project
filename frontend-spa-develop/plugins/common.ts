import moment from 'moment';
import { Common } from '~/types/common';

function totalPage(totalRecord: number, rowPerPage: number) : number {
  return totalRecord < rowPerPage ? 1 : Math.ceil(totalRecord / rowPerPage);
};

function convertTimeToStr(time: Date | null, formatTime: string) : string {
  if (time) {
    return moment(time).format(formatTime);
  }
  return '';
}
function makeToast(context: any, variant: string, toaster: string, title: string, content: string) : void{
  context.$bvToast.toast(content, {
    title,
    variant,
    toaster,
    solid: true
  });
};

const common : Common = {
  totalPage: totalPage,
  convertTimeToStr: convertTimeToStr,
  makeToast: makeToast
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default ({ app }, inject) : void => {
  inject('common', common);
};
