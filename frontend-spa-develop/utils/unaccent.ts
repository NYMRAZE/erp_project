export default function slugify(str: string) : string {
  const map = {
    'a' : 'á|à|ã|ạ|ả|â|ấ|ầ|ẫ|ậ|ẩ|ă|ắ|ằ|ẳ|ặ|ẳ|À|Á|Ã|Â|Ấ|Ầ|Ẩ|Ậ|Ẩ|Ă|Ắ|Ằ|Ặ|Ẳ',
    'd' : 'đ|Đ',
    'e' : 'é|è|ẹ|ẻ|ê|ệ|ế|ề|ể|É|È|Ẹ|Ẻ|Ế|Ề|Ể|Ê',
    'i' : 'í|ì|ỉ|ị|î|Í|Ỉ|Ị',
    'o' : 'ó|ò|ô|õ|ơ|ỏ|ọ|ố|ồ|ổ|ộ|ờ|ớ|ở|Ó|Ò|Ô|Õ|Ô|Ố|Ồ|Ổ|Ộ|Ớ|Ờ|Ở|Ợ',
    'u' : 'ú|ù|ủ|ụ|Ú|Ù|Ụ|Ủ'
  };

  str = str.toLowerCase();
  for (const pattern in map) {
    str = str.replace(new RegExp(map[pattern], 'g'), pattern);
  }

  return str;
};
