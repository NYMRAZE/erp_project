import { Middleware } from '@nuxt/types';
import { FunctionPermission } from '~/types/permissions';
import { FUNCTIONS_CONST, PERMISSION_STATUS } from '~/utils/common-const';

const ModuleRole: Middleware = (context: any) : any => {
  const FUNCTION_NAME = context.route.name.replaceAll('-', '_').toUpperCase();
  const funcPermission: Map<string, FunctionPermission[]> = new Map(Object.entries(context.$auth.user.func_permission));
  const FUNCTION_NUMBER = FUNCTIONS_CONST[FUNCTION_NAME];
  let flag_function = false;

  for (const [key, function_array] of funcPermission) {
    console.log(key);
    function_array.map((user_permission_obj): void => {
      if (user_permission_obj.function_id === FUNCTION_NUMBER) {
        flag_function = PERMISSION_STATUS[user_permission_obj.status];
      }
    });
  }
  if (!flag_function) {
    alert('Bạn không có quyền truy cập vào tính năng này. Trở về trang chủ !');
    return context.redirect('/home-admin');
  }
};

export default ModuleRole;
