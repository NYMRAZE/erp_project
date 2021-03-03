import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import {
  UserProfile,
  FormEditBasicInfo,
  Skill,
  Language,
  Education,
  Certificate,
  Award,
  Experience,
  RankListItem,
  BranchListItem,
  LanguageListItem,
  LevelLanguageListItem,
  ProfileListTable,
  ProfileListSearchParams,
  JobTitleListItem,
  TechnologyListItem,
  InterestTechnology,
  UserTechnology,
  RemoveTechnologyParams
} from '~/types/user-profile';
import { Pagination } from '~/types/registration-requests';
import { axios } from '~/utils/axios-accessor';
import { FailResponseCode } from '~/utils/responsecode';

@Module({
  stateFactory: true,
  namespaced: true,
  name: 'modules/user-profile'
})
export default class UserProfileModule extends VuexModule {
  userProfile: UserProfile | null = null;
  rankList: RankListItem | null = null;
  levelSkillList: Map<string, string> = new Map();
  branchList: BranchListItem | null = null;
  jobTitleList: JobTitleListItem | null = null;
  languageList: LanguageListItem | null = null;
  levelLanguageList: LevelLanguageListItem | null = null;
  technologyList: TechnologyListItem | null = null;
  base64Avatar: string | null = null;
  profileListTable : ProfileListTable[] = [];
  paginationProfileList : Pagination = {
    current_page: 1,
    total_row:    0,
    row_perpage:  0
  }

  get userProfileInfo() : UserProfile  | null  {
    return this.userProfile;
  }

  get imgbase64Avatar() : string | null {
    return this.base64Avatar;
  }

  get takeRankList() : RankListItem | null  {
    return this.rankList;
  }

  get takeBranchList() : BranchListItem | null  {
    return this.branchList;
  }

  get takeLevelSkillList(): Map<string, string> {
    return this.levelSkillList;
  }

  get takeJobTitleList() : JobTitleListItem | null  {
    return this.jobTitleList;
  }

  get takeTechnologyList(): TechnologyListItem | null {
    return this.technologyList;
  }

  get takeLanguageList() : LanguageListItem | null  {
    return this.languageList;
  }

  get takeLevelLanguageList() : LevelLanguageListItem | null  {
    return this.levelLanguageList;
  }

  get objPagination() : Pagination {
    return this.paginationProfileList;
  }

  get arrProfileListTable() : ProfileListTable[] | [] {
    return this.profileListTable.length > 0 ? this.profileListTable : [];
  }

  @Mutation
  setBase64Avatar (imgBase64: string | null) : void {
    this.base64Avatar = imgBase64;
  }

  @Mutation
  setUserProfileInfo(userProfile: UserProfile | null) : void {
    this.userProfile = userProfile;

    if (this.userProfile) {
      this.userProfile.flag_edit_basic_profile = false;
      this.userProfile.flag_edit_skill = false;
      this.userProfile.flag_edit_language = false;
      this.userProfile.flag_edit_education = false;
      this.userProfile.flag_edit_certificate = false;
      this.userProfile.flag_edit_award = false;
      this.userProfile.flag_edit_experience = false;
      this.userProfile.flag_edit_introduce = false;
      this.userProfile.flag_edit_interest_technology = false;
    }
  }

  @Mutation
  setListItemProfile(res: any) : void {
    this.rankList = res.rank_list;
    this.branchList = res.branch_list;
    this.jobTitleList = res.job_title_list;
    this.languageList = res.language_list;
    this.levelLanguageList = res.level_language_list;
    this.technologyList = res.technology_list;
    this.levelSkillList = new Map(Object.entries(res.level_skill_list));
  }

  @Mutation
  editBasicInfo(editBasicInfo: FormEditBasicInfo) : void {
    if (this.userProfile) {
      this.userProfile.avatar = editBasicInfo.avatar;
      this.userProfile.first_name = editBasicInfo.first_name;
      this.userProfile.last_name = editBasicInfo.last_name;
      this.userProfile.phone_number = editBasicInfo.phone_number;
      this.userProfile.birthday = editBasicInfo.birthday;
      this.userProfile.role_id = editBasicInfo.role_id;
      this.userProfile.job_title = editBasicInfo.job_title;
      this.userProfile.rank = editBasicInfo.rank;
      this.userProfile.company_joined_date = editBasicInfo.company_joined_date;
      this.userProfile.branch = editBasicInfo.branch;
      this.userProfile.employee_id = editBasicInfo.employee_id;
      this.userProfile.flag_edit_avatar = editBasicInfo.flag_edit_avatar;
      this.userProfile.flag_edit_basic_profile = true;
    }
  }

  @Mutation
  editSkill(skillArr: Skill[]) : void {
    if (this.userProfile) {
      this.userProfile.skill = skillArr;
      this.userProfile.flag_edit_skill = true;
    }
  }

  @Mutation
  editLanguage(languageArr: Language[]) : void {
    if (this.userProfile) {
      this.userProfile.language = languageArr;
      this.userProfile.flag_edit_language = true;
    }
  }

  @Mutation
  editInterestTechnology(technologyArr: InterestTechnology[]) : void {
    if (this.userProfile) {
      this.userProfile.interest_technology = technologyArr;
      this.userProfile.flag_edit_interest_technology = true;
    }
  }

  @Mutation
  editEducation(educationArr: Education[]) : void {
    if (this.userProfile) {
      this.userProfile.education = educationArr;
      this.userProfile.flag_edit_education = true;
    }
  }

  @Mutation
  editCertificate(certificateArr: Certificate[]) : void {
    if (this.userProfile) {
      this.userProfile.certificate = certificateArr;
      this.userProfile.flag_edit_certificate = true;
    }
  }

  @Mutation
  editAward(awardArr: Award[]) : void {
    if (this.userProfile) {
      this.userProfile.award = awardArr;
      this.userProfile.flag_edit_award = true;
    }
  }

  @Mutation
  editExperience(experienceArr: Experience[]) : void {
    if (this.userProfile) {
      this.userProfile.experience = experienceArr;
      this.userProfile.flag_edit_experience = true;
    }
  }

  @Mutation
  editIntroduce(introduceText: string) : void {
    if (this.userProfile) {
      this.userProfile.introduce = introduceText;
      this.userProfile.flag_edit_introduce = true;
    }
  }

  @Mutation
  setProfileListData(res: any) : void {
    this.paginationProfileList = (res.pagination as Pagination);
    this.profileListTable = (res.profile_list as ProfileListTable[]);
  }

  @Mutation
  public setCurrentPageNumber(pageNumber: number): void {
    this.paginationProfileList.current_page = pageNumber;
  }

  @Action({ commit: 'setUserProfileInfo', rawError: true })
  async getUserProfileInfo(user_id: number) : Promise<UserProfile> {
    const res = await axios!.$post('/api/user/get-user-info', { user_id: user_id });

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return (res.data as UserProfile);
  }

  @Action({ commit: 'setUserProfileInfo', rawError: true })
  resetUserProfile() : null {
    return null;
  }

  @Action({ rawError: true })
  async updateProfile() : Promise<any> {
    const objEditProfile = this.userProfileInfo;
    const res = await axios!.$post('/api/user/update-profile',
      objEditProfile
    );

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ commit: 'setListItemProfile', rawError: true })
  async getListItemProfile() : Promise<any> {
    const res = await axios!.$post('/api/user/get-list-item-profile');

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }

  @Action({ commit: 'setBase64Avatar', rawError: true })
  async downloadImgAvatar() : Promise<any> {
    const res = await axios!.$post('/api/user/get-avatar');

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data.avatar;
  }

  @Action({ commit: 'setProfileListData', rawError: true })
  async searchProfileListTable(profileListSearchParams: ProfileListSearchParams) : Promise<any> {
    const res = await axios!.$post('/api/user/search-user-profile', profileListSearchParams);

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }

  @Action({ rawError: true })
  async createUserTechnologies(userTechnology: UserTechnology[]) : Promise<any> {
    const res = await axios!.$post('/user-technology/create-user-technologies', userTechnology);

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async removeTechnologiesOfUser(params: RemoveTechnologyParams[]) : Promise<any> {
    const res = await axios!.$post('/user-technology/remove-technology-of-user', params);

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async getTechnologiesOfUser(userID: number) : Promise<any> {
    const res = await axios!.$post('/user-technology/get-technology-of-user', { user_id: userID });

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }

  @Action({ rawError: true })
  async importCsv(formData: any): Promise<any> {
    const res = await axios!.$post(
      '/api/user/import-profiles',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } });
    return res;
  }

  @Action({ rawError: true })
  async downloadTemplate(typeFile: string): Promise<any> {
    const res = await axios!.$post(
      '/api/user/download-template',
      { type_file: typeFile }, { responseType: 'blob' });
    return res;
  }
}
