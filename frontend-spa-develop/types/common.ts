export interface Common {
  totalPage(totalRecord: number, rowPerPage: number) : number;
  convertTimeToStr(time: Date | null, formatTime: string) : string;
  makeToast(context: any, variant: string, toaster: string, title: string, content: string) : void;
}
