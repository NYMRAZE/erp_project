import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import { Target } from '~/types/target';
import { FailResponseCode } from '~/utils/responsecode';
import { axios } from '~/utils/axios-accessor';

@Module({
  stateFactory: true,
  namespaced: true,
  name: 'modules/target'
})
export default class TargetModule extends VuexModule {
  target: Target | null = null;
  notAllowToEdit: boolean = true;
  isDuplicateEval: boolean = false;
  isEvalExisted: boolean = false;
  currentEvalID: number | null = null;

  get takeTarget() : Target | null {
    return this.target;
  }

  get takeTargetStatus() : number {
    return this.target ? this.target.status : 1;
  }

  get evalID() : number {
    return this.target ? this.target.id : 0;
  }

  get userID() : number {
    return this.target ? this.target.user_id : 0;
  }

  @Mutation
  setTarget(target: Target | null) : void {
    this.target = target;
  }

  get duplicateEval() : boolean {
    return this.isDuplicateEval;
  }

  get evalFormID() : number | null {
    return this.currentEvalID;
  }

  get evalExisted() : boolean {
    return this.isEvalExisted;
  }

  @Mutation
  setDuplicateEval(isDuplicateEval: boolean | false) : void {
    this.isDuplicateEval = isDuplicateEval;
  }

  @Mutation
  setEvalID(evaID: number | null) : void {
    this.currentEvalID = evaID;
  }

  @Mutation
  setEvalExisted(isEvalExisted: boolean | false) : void {
    this.isEvalExisted = isEvalExisted;
  }

  get takeNotAllowToEdit() : boolean {
    return this.notAllowToEdit;
  }

  @Mutation
  setNotAllowToEdit(notAllowToEdit: boolean) : void {
    this.notAllowToEdit = notAllowToEdit;
  }

  @Action({ rawError: true })
  async createTarget(content: object) : Promise<any> {
    const res = await axios!.$post('/evaluation/create-evaluation', content);
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ commit: 'setTarget', rawError: true })
  async getTarget(eval_form_id: number) : Promise<Target> {
    const res = await axios!.$post('/evaluation/get-evaluation', { eval_form_id });

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return (res.data as Target);
  }

  @Action({ rawError: true })
  async editTarget(content: object) : Promise<any> {
    const res = await axios!.$post('/evaluation/update-evaluation', content);
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ commit: 'setTarget', rawError: true })
  async duplicateTarget(eval_form_id: number) : Promise<any> {
    const res = await axios!.$post('/evaluation/duplicate-evaluation', { eval_form_id });
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return (res.data as Target);
  }
}
