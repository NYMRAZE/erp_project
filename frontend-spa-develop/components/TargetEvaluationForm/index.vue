<template>
  <ValidationObserver ref="observer">
    <div>
      <div class="pb-3 btn-group-nav">
        <button
          class="btn font-weight-bold bg-white mr-2"
          :class="(takeTarget && checkAllowToEdit) || !checkAllowToEdit ? 'btn-secondary-no-bg' : 'btn-primary-no-bg'"
          @click.prevent="goToCreateEval">
          {{ $t("Create new evaluation") }}
        </button>
        <button
          class="btn btn-secondary-no-bg font-weight-bold bg-white"
          @click.prevent="goToMemberEval">
          {{ $t("Member evaluation list") }}
        </button>
      </div>
      <div class="card">
        <div class="wrap-content">
          <div class="wrap-content-left">
            <div class="user-content-info h-100">
              <div class="user-info">
                <div class="border-right h-100 pl-3">
                  <div class="d-flex flex-column justify-content-center h-100">
                    <span class="font-weight-bold">{{ fullUserName }}</span>
                    <span class="text-gray">{{ `${$t('Branch')}: ${branchUser}` }}</span>
                  </div>
                </div>
              </div>
              <div class="user-eval-info">
                <div class="user-eval-1">
                  <div class="eval-weight-grades h-100 border-right pl-3">
                    <span class="font-weight-bold">{{ `${$t('Weights')}: ${totalWeight}` }}</span>
                    <span class="font-weight-bold">{{ `${$t('Grades')}: ${totalPoints}` }}</span>
                  </div>
                </div>
                <div class="user-eval-2 d-flex align-items-center border-right pl-3">
                  <span class="font-weight-bold">{{ `${$t('Current rank')}: ${takeCurrentRank}` }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="wrap-content-right">
            <div class="form-row">
              <div class="col-7">
                <div class="year-quarter-select h-100 p-3">
                  <div class="form-group mb-0 mr-2">
                    <p class="font-weight-bold m-0 mr-2">{{ $t('Year') }}</p>
                    <ValidationProvider v-slot="{ errors }" rules="required|numeric" name="Year">
                      <input
                        v-model.number="contentForm.year"
                        type="text"
                        class="form-control font-weight-bold text-left mr-2"
                        :class="{ 'is-invalid': errors[0] }"
                        :readonly="takeTarget && !isDuplicateEval && !isEvalExisted">
                      <p v-if="errors[0]" class="invalid-feedback text-left">{{ errors[0] }}</p>
                    </ValidationProvider>
                  </div>
                  <div class="form-group mb-0">
                    <p class="font-weight-bold m-0 mr-2">{{ $t('quarter') }}</p>
                    <ValidationProvider v-slot="{ errors }" rules="required" name="Quarter">
                      <select
                        v-model="contentForm.quarter"
                        class="form-control font-weight-bold mr-2"
                        :class="{ 'is-invalid': errors[0] }"
                        :disabled="takeTarget && !isDuplicateEval && !isEvalExisted"
                        @change="changeQuarter">
                        <template v-for="(item, index) in listQuarter">
                          <option :key="index" :selected="item === contentForm.quarter" :value="item">{{ item }}</option>
                        </template>
                      </select>
                      <p v-if="errors[0]" class="invalid-feedback text-left">{{ errors[0] }}</p>
                    </ValidationProvider>
                  </div>
                </div>
              </div>
              <div class="col-5">
                <div class="d-flex justify-content-center flex-column py-2 h-100">
                  <div class="d-flex align-items-center mb-2">
                    <div class="rectangle user-input-color mr-1"></div>
                    <span class="text-gray">{{ $t('User input field') }}</span>
                  </div>
                  <div class="d-flex align-items-center">
                    <div class="rectangle superior-input-color mr-1"></div>
                    <span class="text-gray">{{ $t('Superior input field') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Common Goal -->
      <div
        class="card card-style mt-4"
        data-aos="fade-up"
        data-aos-delay="50"
        data-aos-duration="1000"
        data-aos-easing="ease-in-out"
        data-aos-once="true">
        <div
          v-b-toggle.card-common-target
          class="card-header-evaluation card-header border-wrap no-bg-color p-3">
          <h5 class="card-title mb-0">
            <div class="title-head d-flex align-items-center">
              <span class="font-bold text-blue">{{ $t('Common Goal') }}</span>
            </div>
            <i class="when-opened fa fa-chevron-up fa-pull-right"></i>
            <i class="when-closed fa fa-chevron-down fa-pull-right"></i>
          </h5>
        </div>
        <b-collapse id="card-common-target" class="no-bg-color overflow-x mb-0" visible>
          <table class="table table-eval table-responsive-sm">
            <thead>
              <tr>
                <th class="table-head text-center head-target-weight border-0 text-white bg-color-user-eval">
                  <span class="required d-flex justify-content-center">{{ $t('Weight') }}</span>
                </th>
                <th class="table-head text-center head-target-name border-0 text-white bg-color-user-eval">
                  <span class="required d-flex justify-content-center">{{ $t('Evalue Item') }}</span>
                </th>
                <th class="table-head text-center head-target-name border-0 text-white bg-color-user-eval">
                  <span class="required d-flex justify-content-center">{{ $t('Goal') }}</span>
                </th>
                <th
                  class="table-head text-center head-target-eval border-0 text-white bg-color-admin-eval">
                  <span>{{ $t('Actual(%)') }}</span>
                </th>
                <th class="table-head text-center head-target-eval border-0"><span>{{ $t('Goal Rate') }}</span></th>
                <th
                  class="table-head text-center head-target-eval border-0"
                  style="border-right: 0 !important">
                  <span>{{ $t('Evalue Grade') }}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="wrap row-position">
                  <ValidationProvider v-slot="{ errors }" rules="eval_required|eval_between:0,100">
                    <input
                      v-model.number="common.weight"
                      type="text"
                      placeholder="0"
                      class="form-control text-center border-0"
                      :class="{ 'is-invalid': errors[0] }"
                      :readonly="takeTarget && checkAllowToEdit && !isDuplicateEval && !isEvalExisted">
                    <p v-if="errors[0]" class="invalid-feedback text-left">{{ errors[0] }}</p>
                  </ValidationProvider>
                </td>
                <td class="wrap row-position">
                  <ValidationProvider v-slot="{ errors }" rules="eval_required">
                    <textarea
                      v-model="common.value"
                      class="form-control text-left border-0"
                      :class="{ 'is-invalid': errors[0] }"
                      style="overflow: auto"
                      :placeholder="$t('Goal name')"
                      rows="4"
                      :readonly="takeTarget && checkAllowToEdit && !isDuplicateEval && !isEvalExisted" />
                    <p v-if="errors[0]" class="invalid-feedback text-left" style="margin-top: -18px">{{ errors[0] }}</p>
                  </ValidationProvider>
                </td>
                <td class="wrap row-position">
                  <ValidationProvider
                    v-slot="{ errors }"
                    rules="eval_required|floatNum"
                    vid="common.numeric">
                    <input
                      v-model.number="common.numeric"
                      type="text"
                      class="form-control text-center border-0"
                      placeholder="0"
                      :class="{ 'is-invalid': errors[0] }"
                      :readonly="takeTarget && checkAllowToEdit && !isDuplicateEval && !isEvalExisted">
                    <p v-if="errors[0]" class="invalid-feedback text-left">{{ errors[0] }}</p>
                  </ValidationProvider>
                </td>
                <td class="wrap row-position">
                  <ValidationProvider v-slot="{ errors }" rules="floatNum">
                    <input
                      v-model.number="common.actual_eval"
                      type="text"
                      class="form-control text-center no-bg-color border-0"
                      placeholder="0"
                      :class="{ 'is-invalid': errors[0] }"
                      :readonly="checkAllowToEdit || (isUser && !isAllowedUserEval)">
                    <p v-if="errors[0]" class="invalid-feedback text-left">{{ errors[0] }}</p>
                  </ValidationProvider>
                </td>
                <td class="wrap row-position">
                  <input
                    type="text"
                    placeholder="0"
                    :value="commonCompletionRate"
                    class="form-control text-center input-eval no-bg-color border-0"
                    readonly>
                </td>
                <td class="wrap row-position">
                  <input
                    type="text"
                    :value="commonPoints"
                    class="form-control text-center input-eval no-bg-color border-0"
                    style="border-right: 0 !important"
                    readonly>
                </td>
              </tr>
            </tbody>
          </table>
        </b-collapse>
      </div>
      <!-- End Common Target -->

      <!-- Individual Goal -->
      <div
        class="card mt-3 card-style"
        data-aos="fade-up"
        data-aos-delay="50"
        data-aos-duration="1000"
        data-aos-easing="ease-in-out"
        data-aos-once="true">
        <div
          v-b-toggle.card-individual-target
          class="card-header-evaluation card-header border-wrap no-bg-color p-3">
          <h5 class="card-title mb-0">
            <div class="title-head d-flex align-items-center">
              <span class="font-bold text-blue">{{ $t('Individual Goal') }}</span>
            </div>
            <i class="when-opened fa fa-chevron-up fa-pull-right"></i>
            <i class="when-closed fa fa-chevron-down fa-pull-right"></i>
          </h5>
        </div>
        <b-collapse id="card-individual-target" class="no-bg-color overflow-x mb-0" visible>
          <table class="table table-eval table-responsive-sm">
            <thead>
              <tr>
                <th class="table-head text-center border-0 head-target-weight bg-color-user-eval text-white"><span>{{ $t('Weight') }}</span></th>
                <th class="table-head text-center border-0 head-target-name bg-color-user-eval text-white"><span>{{ $t('Evalue Item') }}</span></th>
                <th class="table-head text-center border-0 head-target-name bg-color-user-eval text-white"><span>{{ $t('Goal') }}</span></th>
                <th class="table-head text-center border-0 head-target-eval bg-color-admin-eval text-white"><span>{{ $t('Actual') }}</span></th>
                <th class="table-head text-center border-0 head-target-eval"><span>{{ $t('Goal Rate') }}</span></th>
                <th
                  class="table-head text-center border-0 head-target-eval"
                  style="border-right: 0 !important">
                  <span>{{ $t('Evalue Grade') }}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(individual, index) in individuals" v-bind:key="index" class="project row-position">
                <td class="wrap row-position">
                  <div class="input-position">
                    <ValidationProvider v-slot="{ errors }" rules="eval_between:0,100">
                      <input
                        v-model.number="individual.weight"
                        type="text"
                        class="form-control input-eval border-0"
                        placeholder="0"
                        :class="{ 'is-invalid': errors[0] }"
                        :readonly="takeTarget && checkAllowToEdit && !isDuplicateEval && !isEvalExisted">
                      <p v-if="errors[0]" class="invalid-feedback text-left">{{ errors[0] }}</p>
                    </ValidationProvider>
                  </div>
                </td>
                <td>
                  <textarea
                    v-model="individual.item"
                    class="form-control text-left border-0"
                    style="overflow: auto"
                    :placeholder="individual.placeholder ? $t(`${individual.placeholder}`) : ''"
                    rows="4"
                    :readonly="takeTarget && checkAllowToEdit && !isDuplicateEval && !isEvalExisted" />
                </td>
                <td class="row-position">
                  <div class="input-position">
                    <ValidationProvider v-slot="{ errors }" rules="eval_numeric">
                      <input
                        v-model.number="individual.goal"
                        type="text"
                        class="form-control text-center input-eval border-0"
                        placeholder="0"
                        :class="{ 'is-invalid': errors[0] }"
                        :readonly="takeTarget && checkAllowToEdit && !isDuplicateEval && !isEvalExisted">
                      <p v-if="errors[0]" class="invalid-feedback text-left">{{ errors[0] }}</p>
                    </ValidationProvider>
                  </div>
                </td>
                <td class="row-position">
                  <div class="input-position">
                    <ValidationProvider v-slot="{ errors }" rules="eval_numeric">
                      <input
                        v-model.number="individual.actual_eval"
                        type="text"
                        class="form-control text-center input-eval border-0"
                        placeholder="0"
                        :class="{ 'is-invalid': errors[0] }"
                        :readonly="takeTarget && checkAllowToEdit && !isDuplicateEval && !isEvalExisted">
                      <p v-if="errors[0]" class="invalid-feedback text-left">{{ errors[0] }}</p>
                    </ValidationProvider>
                  </div>
                </td>
                <td class="row-position">
                  <div class="input-position">
                    <input
                      type="text"
                      class="form-control text-center input-eval border-0 no-bg-color"
                      :value="takeGoalRate(individual)"
                      placeholder="0"
                      readonly>
                  </div>
                </td>
                <td>
                  <div class="input-position row-position">
                    <input
                      type="text"
                      class="form-control text-center input-eval border-0 no-bg-color"
                      style="border-right: 0 !important"
                      :value="individualPoints(individual)"
                      placeholder="0"
                      readonly>
                    <div
                      class="delete-btn d-flex"
                      :style="(checkAllowToEdit && takeTarget && !isDuplicateEval) && 'opacity: 0;'">
                      <button
                        type="button"
                        class="btn btn-success btn-sm border-0"
                        @click="addIndividualRow(index)">
                        <i class="fas fa-plus fa-lg"></i>
                      </button>
                      <button
                        type="button"
                        class="btn btn-danger btn-sm border-0"
                        @click="removeIndividualRow(index)">
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </b-collapse>
      </div>
      <!-- End Individual Target -->

      <!-- Project Goal -->
      <div
        class="card card-style mt-3"
        data-aos="fade-up"
        data-aos-delay="50"
        data-aos-duration="1000"
        data-aos-easing="ease-in-out"
        data-aos-once="true">
        <div>
          <div
            v-b-toggle.card-project-target
            class="card-header-evaluation card-header border-wrap no-bg-color p-3">
            <h5 class="card-title mb-0">
              <div class="title-head d-flex align-items-center">
                <span class="font-bold text-blue">{{ $t('Project Goal') }}</span>
              </div>
              <i class="when-opened fa fa-chevron-up fa-pull-right"></i>
              <i class="when-closed fa fa-chevron-down fa-pull-right"></i>
            </h5>
          </div>
        </div>
        <b-collapse id="card-project-target" class="no-bg-color overflow-x mb-0" visible>
          <table class="table table-eval table-responsive-sm">
            <thead>
              <tr>
                <th class="text-center border-0 head-target-weight bg-color-user-eval">
                  <div class="d-flex justify-content-center align-items-center height-45px">
                    <span class="table-head text-white">
                      {{ $t('Weight') }}
                    </span>
                  </div>
                </th>
                <th class="text-center border-0 head-target-name bg-color-user-eval">
                  <div class="d-flex justify-content-center align-items-center height-45px">
                    <span class="table-head text-white">
                      {{ $t('projects') }}
                    </span>
                  </div>
                </th>
                <th class="text-center border-0 head-target-name bg-color-user-eval">
                  <div class="d-flex justify-content-center align-items-center height-45px">
                    <span class="table-head text-white">
                      {{ $t('Evalue Item') }}
                    </span>
                  </div>
                </th>
                <th class="table-head text-center border-0 head-target-eval bg-color-user-eval">
                  <pre class="text-white">{{ $t('Self Evaluation') }}</pre>
                </th>
                <th class="table-head text-center border-0 head-target-eval bg-color-admin-eval">
                  <pre class="text-white">{{ $t('Supervisor Evaluation') }}</pre>
                </th>
                <th class="text-center border-0 head-target-eval" style="border-right: 0 !important">
                  <div class="d-flex justify-content-center align-items-center height-45px">
                    <span class="table-head">
                      {{ $t('Evalue Grade') }}
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(project, index) in projectTarget" v-bind:key="index" class="row-position">
                <td>
                  <input
                    v-model.number="project.weight"
                    type="text"
                    placeholder="0"
                    class="form-control text-center input-project-eval border-0"
                    :readonly="takeTarget && checkAllowToEdit && !isDuplicateEval && !isEvalExisted">
                </td>
                <td>
                  <select
                    v-model="project.id"
                    class="form-control"
                    :disabled="takeTarget && checkAllowToEdit && !isDuplicateEval && !isEvalExisted"
                    @change="onChangeProject($event, index)">
                    <option :value="null"></option>
                    <option
                      v-for="(p, i) in projectsListData"
                      :key="i"
                      :selected="project.project_id === p.project_id"
                      :value="p.project_id"
                      :class="checkSelectedProject(p.project_id) && 'option-selected-bg'"
                      :disabled="checkSelectedProject(p.project_id)">
                      {{ p.project_name }}
                    </option>
                  </select>
                </td>
                <td>
                  <textarea
                    v-model="project.action"
                    class="form-control text-left input-project-eval border-0 no-bg-color"
                    style="overflow: auto"
                    :placeholder="$t('detail')"
                    rows="8"
                    readonly />
                </td>
                <td>
                  <input
                    v-model.number="project.self_assessment"
                    type="text"
                    class="form-control text-center input-project-eval border-0 no-bg-color"
                    placeholder="0"
                    :readonly="takeTarget && checkAllowToEdit && !isDuplicateEval && !isEvalExisted">
                </td>
                <td>
                  <input
                    v-model.number="project.superior_eval"
                    type="text"
                    class="form-control text-center input-project-eval border-0 no-bg-color"
                    placeholder="0"
                    :readonly="checkAllowToEdit || (isUser && !isAllowedUserEval)">
                </td>
                <td>
                  <div class="row-position">
                    <input
                      type="text"
                      :value="projectPoints(project)"
                      class="form-control text-center input-project-eval border-0 no-bg-color"
                      style="border-right: 0 !important"
                      readonly>
                    <div
                      class="d-flex delete-btn"
                      :style="(checkAllowToEdit && takeTarget && !isDuplicateEval) && 'opacity: 0;'">
                      <button
                        type="button"
                        class="btn btn-success btn-sm border-0"
                        @click="addRow(index)">
                        <i class="fas fa-plus fa-lg"></i>
                      </button>
                      <button
                        type="button"
                        class="btn btn-danger btn-sm border-0"
                        @click="removeRow(index)">
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </b-collapse>
      </div>
      <!-- End Project Target -->

      <!-- Others target -->
      <div
        class="card card-style mt-3"
        data-aos="fade-up"
        data-aos-delay="50"
        data-aos-duration="1000"
        data-aos-easing="ease-in-out"
        data-aos-once="true">
        <div>
          <div
            v-b-toggle.card-others-target
            class="card-header-evaluation card-header border-wrap no-bg-color p-3">
            <h5 class="card-title mb-0">
              <div class="title-head d-flex align-items-center">
                <span class="font-bold text-blue">{{ $t('Others Goal') }}</span>
              </div>
              <i class="when-opened fa fa-chevron-up fa-pull-right"></i>
              <i class="when-closed fa fa-chevron-down fa-pull-right"></i>
            </h5>
          </div>
        </div>
        <b-collapse id="card-others-target" class="no-bg-color overflow-x mb-0" visible>
          <table class="table table-eval table-responsive-sm">
            <thead>
              <tr>
                <th class="text-center border-0 head-target-weight bg-color-user-eval">
                  <div class="d-flex justify-content-center align-items-center height-45px">
                    <span class="table-head text-white required">
                      {{ $t('Weight') }}
                    </span>
                  </div>
                </th>
                <th class="text-center border-0 head-target-name bg-color-user-eval">
                  <div class="d-flex justify-content-center align-items-center height-45px">
                    <span class="table-head text-white required">
                      {{ $t('Others Goal Name') }}
                    </span>
                  </div>
                </th>
                <th class="text-center border-0 head-target-name bg-color-user-eval">
                  <div class="d-flex justify-content-center align-items-center height-45px">
                    <span class="table-head text-white required">
                      {{ $t('Detail') }}
                    </span>
                  </div>
                </th>
                <th class="table-head text-center border-0 head-target-eval bg-color-user-eval">
                  <pre class="text-white">{{ $t('Self Evaluation') }}</pre>
                </th>
                <th class="table-head text-center border-0 head-target-eval bg-color-admin-eval">
                  <pre class="text-white">{{ $t('Supervisor Evaluation') }}</pre>
                </th>
                <th class="table-head text-center border-0 head-target-eval" style="border-right: 0 !important">
                  <div class="d-flex justify-content-center align-items-center height-45px">
                    <span class="table-head">
                      {{ $t('Evalue Grade') }}
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(challenge, index) in challenges" v-bind:key="index" class="row-position">
                <td>
                  <ValidationProvider v-slot="{ errors }" rules="eval_required|eval_between:0,100">
                    <input
                      v-model.number="challenge.weight"
                      type="text"
                      placeholder="0"
                      class="form-control text-center input-eval border-0"
                      :class="{ 'is-invalid': errors[0] }"
                      :readonly="takeTarget && checkAllowToEdit && !isDuplicateEval && !isEvalExisted">
                    <p v-if="errors[0]" class="invalid-feedback text-left">{{ errors[0] }}</p>
                  </ValidationProvider>
                </td>
                <td>
                  <ValidationProvider v-slot="{ errors }" rules="eval_required">
                    <textarea
                      v-model="challenge.name"
                      class="form-control text-left border-0"
                      :class="{ 'is-invalid': errors[0] }"
                      style="overflow: auto"
                      :placeholder="$t('Target name')"
                      rows="5"
                      :readonly="takeTarget && checkAllowToEdit && !isDuplicateEval && !isEvalExisted" />
                    <p v-if="errors[0]" class="invalid-feedback text-left" style="margin-top: -18px">{{ errors[0] }}</p>
                  </ValidationProvider>
                </td>
                <td>
                  <ValidationProvider v-slot="{ errors }" rules="eval_required">
                    <textarea
                      v-model="challenge.actions"
                      class="form-control text-left border-0"
                      :class="{ 'is-invalid': errors[0] }"
                      style="overflow: auto"
                      :placeholder="$t('Action detail')"
                      rows="5"
                      :readonly="takeTarget && checkAllowToEdit && !isDuplicateEval && !isEvalExisted" />
                    <p v-if="errors[0]" class="invalid-feedback text-left" style="margin-top: -18px">{{ errors[0] }}</p>
                  </ValidationProvider>
                </td>
                <td>
                  <ValidationProvider v-slot="{ errors }" rules="floatNum">
                    <input
                      v-model.number="challenge.self_assessment"
                      type="text"
                      class="form-control text-center input-eval border-0"
                      placeholder="0"
                      :class="{ 'is-invalid': errors[0] }"
                      :readonly="takeTarget && checkAllowToEdit && !isDuplicateEval && !isEvalExisted">
                    <p v-if="errors[0]" class="invalid-feedback text-left">{{ errors[0] }}</p>
                  </ValidationProvider>
                </td>
                <td>
                  <ValidationProvider v-slot="{ errors }" rules="floatNum">
                    <input
                      v-model.number="challenge.superior_eval"
                      type="text"
                      class="form-control text-center input-eval border-0 no-bg-color"
                      placeholder="0"
                      :class="{ 'is-invalid': errors[0] }"
                      :readonly="checkAllowToEdit || (isUser && !isAllowedUserEval)">
                    <p v-if="errors[0]" class="invalid-feedback text-left">{{ errors[0] }}</p>
                  </ValidationProvider>
                </td>
                <td>
                  <div class="row-position">
                    <input
                      type="text"
                      :value="challengePoints(challenge)"
                      class="form-control text-center no-bg-color input-eval border-0"
                      style="border-right: 0 !important"
                      readonly>
                    <div
                      class="d-flex delete-btn"
                      :style="(checkAllowToEdit && takeTarget && !isDuplicateEval) && 'opacity: 0;'">
                      <button
                        type="button"
                        class="btn btn-success btn-sm border-0"
                        @click="addChallengeRow(index)">
                        <i class="fas fa-plus fa-lg"></i>
                      </button>
                      <button
                        type="button"
                        class="btn btn-danger btn-sm border-0"
                        @click="removeChallengeRow(index)">
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </b-collapse>
      </div>
      <!-- End Others target -->

      <!-- Comment -->
      <div
        class="card card-style mt-3"
        data-aos="fade-up"
        data-aos-delay="50"
        data-aos-duration="1000"
        data-aos-easing="ease-in-out"
        data-aos-once="true">
        <div
          v-b-toggle.card-comment-target
          class="card-header-evaluation card-header border-wrap no-bg-color p-3">
          <h5 class="card-title text-dark mb-0">
            <div class="title-head d-flex align-items-center">
              <span class="font-bold text-blue">{{ $t('Comment') }}</span>
            </div>
            <i class="when-opened fa fa-chevron-up fa-pull-right"></i>
            <i class="when-closed fa fa-chevron-down fa-pull-right"></i>
          </h5>
        </div>
        <b-collapse id="card-comment-target" class="no-bg-color overflow-x mb-0" visible>
          <table class="table table-eval table-responsive-sm">
            <thead>
              <tr>
                <th class="table-head text-center head-comment border-0 bg-color-user-eval text-white"><span>{{ $t('Self') }}</span></th>
                <th class="table-head text-center head-comment border-0 bg-color-admin-eval text-white" style="border-right: 0 !important">
                  <span>{{ $t('Supervisor') }}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <textarea
                    v-model="comment.self_cmt"
                    class="form-control border-0"
                    style="overflow: auto"
                    :placeholder="$t('Your comment')"
                    rows="20"
                    :readonly="takeTarget && checkAllowToEdit && !isDuplicateEval && !isEvalExisted" />
                </td>
                <td>
                  <textarea
                    v-model="comment.superior_cmt"
                    class="form-control border-0 no-bg-color"
                    style="overflow: auto; border-right: 0 !important"
                    :placeholder="$t('Supervisor comment')"
                    rows="20"
                    :readonly="checkAllowToEdit || (isUser && !isAllowedUserEval)" />
                </td>
              </tr>
            </tbody>
          </table>
        </b-collapse>
      </div>
      <!-- End Comment -->
      <div class="border-0 mt-3 py-3">
        <div>
          <div class="d-flex justify-content-between">
            <div class="d-inline-flex">
              <input
                v-if="checkAllowToEdit && takeTarget && !isDuplicateEval"
                type="submit"
                :value="$t('Edit')"
                class="btn btn-primary2 mr-2"
                @click.prevent="editTarget">
              <button
                v-if="checkAllowToEdit && takeTarget && isSelfEval && !isDuplicateEval"
                type="button"
                class="btn btn-info mr-2"
                @click.prevent="duplicateEval">
                {{ $t('Copy') }}
              </button>
              <input
                v-if="!checkAllowToEdit || !takeTarget || isDuplicateEval"
                type="submit"
                :value="!checkAllowToEdit && takeTarget && !isDuplicateEval ? $t('Save') : $t('Submit')"
                class="btn btn-success2 mr-2 w-100px"
                @click.prevent="handleSubmitTarget()">
              <input
                v-if="checkAllowToEdit && takeTarget && !isDuplicateEval"
                type="submit"
                :value="$t('Close')"
                class="btn btn-secondary2"
                @click.prevent="closeFormView">
              <input
                v-else
                type="submit"
                :value="$t('Cancel')"
                class="btn btn-secondary2 w-100px font-weight-bold"
                @click.prevent="closeForm">
            </div>
            <div>
              <button
                v-if="checkAllowToEdit && takeTarget && !isDuplicateEval"
                type="button"
                class="btn btn-success2"
                @click.prevent="exportExcel">
                {{ $t('Export Excel') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ValidationObserver>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { Challenge, Comment, Common, Individual, Project, Result, Target, TargetContent } from '~/types/target';
import { evaluationStore, layoutAdminStore, projectStore, targetStore, userProfileStore } from '~/store/index';
import { GeneralManagerRoleID, ManagerRoleID, UserRoleID } from '~/utils/responsecode';
import {
  EvaluationCreatedStatus,
  EvaluationMemberIsCreatingStatus,
  EvaluationMemberIsEditingStatus,
  EvaluationVNManagerIsReviewingStatus
} from '~/utils/responsestatus';
import { ExportEvaluationExcel } from '~/types/evaluation';

@Component({
})
export default class CreateTarget extends Vue {
  title: string = ''
  topIcon: string = ''
  target: Target | null = this.takeTarget

  currentYear = new Date().getFullYear()
  currentQuarter =  Math.floor((new Date().getMonth() + 3) / 3)
  isAdmin: boolean = this.$auth.user.role_id === GeneralManagerRoleID || this.$auth.user.role_id === ManagerRoleID
  isUser: boolean = this.$auth.user.role_id === UserRoleID
  pramId: string = ''
  msgEditRes: string = ''
  branchList = new Map(Object.entries(this.$auth.user.branch_list_box));

  listQuarter : number[] = [1, 2, 3, 4];

  projectTarget: Project[] = this.takeProject

  common: Common = this.takeCommon

  individuals: Individual[] = this.takeIndividual

  challenges: Challenge[] = this.takeChallenge

  comment: Comment = this.takeComment

  result: Result = {
    total_actual_eval: 0,
    completion_rate: 0,
    points: 0,
    weight: 0,
    rank: 3
  }

  targetContent: TargetContent = {
    common: this.common,
    individuals: this.individuals,
    projects: this.projectTarget,
    challenges: this.challenges,
    comment: this.comment,
    result: this.result
  }

  contentForm: Target = {
    content: this.targetContent,
    year: this.takeYear,
    quarter: this.takeQuarter,
    status: this.takeStatus,
    id: targetStore.evalID,
    user_id: targetStore.userID
  }

  initialForm : object = {}
  @Prop() isEvalSummitted!: boolean
  @Prop() iscreate!: boolean
  responseMessage: string = ''
  totalWeightErr: string = ''

  EvaluationRankList = new Map([
    [1, 'S'],
    [2, 'A'],
    [3, 'B'],
    [4, 'C'],
    [5, 'D']
  ]);

  beforeMount() {
    if (this.target && this.target.user_id !== parseInt(this.$auth.user.id)) {
      userProfileStore.getUserProfileInfo(this.target.user_id);
    }
  }

  mounted() {
    const $this = this;
    this.title = 'Evaluation';
    layoutAdminStore.setTitlePage(this.title);
    this.topIcon = 'fa fa-tasks';
    layoutAdminStore.setIconTopPage(this.topIcon);

    this.pramId = this.$route.params.id;
    setTimeout(async function () {
      await $this.getUsersManagedList();
      await $this.searchRequest();
    }, 100);

    setTimeout(() => {
      this.initialForm = JSON.parse(JSON.stringify(this.contentForm));
      this.$emit('setIsEditedEval', this.isEditedForm(this.initialForm, this.contentForm));
    }, 100);
  }

  beforeUpdate() {
    window.addEventListener('beforeunload', this.handleReloadPage, false);
    this.$emit('setIsEditedEval', this.isEditedForm(this.initialForm, this.contentForm));
  }

  beforeDestroy() {
    window.removeEventListener('beforeunload', this.handleReloadPage, false);
  }

  // fetch goal's data from api
  get takeTarget() {
    return targetStore.takeTarget;
  }

  get takeYear() {
    return this.target && !this.isDuplicateEval ? this.target.year : this.currentYear;
  }

  get takeQuarter() {
    return this.target && !this.isDuplicateEval ? this.target.quarter : this.currentQuarter;
  }

  get takeStatus() {
    return this.target ? this.target.status : EvaluationCreatedStatus;
  }

  get takeCommon(): Common {
    const target = this.target;

    if (target) {
      if (this.isDuplicateEval) {
        return Object.assign({}, { ...target.content.common, actual_eval: null, completion_rate: null, points: null });
      } else {
        return Object.assign({}, target.content.common);
      }
    } else {
      return {
        value: '',
        numeric: null,
        actual_eval: null,
        completion_rate: null,
        points: null,
        weight: null
      };
    }
  }

  get takeIndividual() {
    let newArrIndividual : Individual[] = [];
    if (this.target) {
      const arrIndividual = this.target.content.individuals;

      if (arrIndividual && arrIndividual.length > 0) {
        arrIndividual.forEach((value) => {
          const itemTarget : Individual = Object.assign({},
            this.isDuplicateEval ? { ...value, actual_eval: null, completion_rate: null, points: null } : value);
          newArrIndividual = [ ...newArrIndividual, itemTarget ];
        });
      }
    } else {
      newArrIndividual = [
        {
          weight           : null,
          item             : null,
          goal             : null,
          actual_eval      : null,
          completion_rate  : null,
          points           : null,
          placeholder      : 'Blog'
        },
        {
          weight           : null,
          item             : null,
          goal             : null,
          actual_eval      : null,
          completion_rate  : null,
          points           : null,
          placeholder      : 'Japanese Language'
        }
      ];
    }
    return newArrIndividual;
  }

  get takeProject() {
    let newArrProject : Project[] = [];
    if (this.target) {
      const arrProject = this.target.content.projects;

      if (arrProject && arrProject.length > 0) {
        arrProject.forEach((value) => {
          value.action = this.target
            ? this.getTargetContentByQuarter(value.id, this.target.year, this.target.quarter) : '';
          const itemTarget : Project = Object.assign({},
            this.isDuplicateEval ? { ...value, self_assessment: null, superior_eval: null, points: null } : value);
          newArrProject = [ ...newArrProject, itemTarget ];
        });
      }
    } else {
      newArrProject = [
        {
          id : null,
          action: '',
          self_assessment: null,
          superior_eval: null,
          points: null,
          weight: null
        }
      ];
    }
    return newArrProject;
  }

  get isDuplicateEval() {
    return targetStore.duplicateEval;
  }

  get isEvalExisted() {
    return targetStore.evalExisted;
  }

  get branchUser() {
    return this.$auth.user.branch
      ? this.branchList.get(this.$auth.user.branch.toString())
      : '';
  }

  get takeChallenge() {
    let newArrChallenge : Challenge[] = [];
    if (this.target) {
      const arrChallenges = this.target.content.challenges;

      if (arrChallenges && arrChallenges.length > 0) {
        arrChallenges.forEach((value) => {
          const itemTarget : Challenge = Object.assign({},
            this.isDuplicateEval ? { ...value, self_assessment: null, superior_eval: null, points: null } : value);
          newArrChallenge = [ ...newArrChallenge, itemTarget ];
        });
      }
    } else {
      newArrChallenge = [
        {
          name: '',
          actions: '',
          self_assessment: null,
          superior_eval: null,
          points: null,
          weight: null
        }
      ];
    }

    return newArrChallenge;
  }

  get takeComment() {
    const target = this.target;

    if (target) {
      if (this.isDuplicateEval) {
        return Object.assign({}, { ...target.content.comment, self_cmt: '', superior_cmt: '' });
      } else {
        return Object.assign({}, target.content.comment);
      }
    } else {
      return {
        self_cmt: '',
        superior_cmt: ''
      };
    }
  }
  get takeResMsg() {
    return this.responseMessage;
  }
  async searchRequest() {
    try {
      await evaluationStore.getEvaluationTable();
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.responseMessage = err.response.data.message;
      } else {
        this.responseMessage = err.message;
      }
    }
  }

  get projectsListData() {
    return projectStore.takeProjectUserJoin;
  }

  get isSelfEval() {
    return this.target && this.target.user_id === this.$auth.user.id;
  }

  // get full name user
  get fullUserName() {
    if (this.target && userProfileStore.userProfileInfo && this.target.user_id !== this.$auth.user.id) {
      const userProfile = userProfileStore.userProfileInfo;
      return userProfile.first_name + ' ' + userProfile.last_name;
    }
    return this.$auth.user.first_name + ' ' + this.$auth.user.last_name;
  }

  // common's completion rate by manager
  get commonCompletionRate() {
    this.common.completion_rate = this.common.actual_eval;
    return this.common.completion_rate;
  }

  // calculate common points
  get commonPoints() {
    this.common.points = this.calculatePoints(this.common.weight, this.common.completion_rate);
    return this.common.points;
  }

  get takeUserList() {
    return projectStore.takeUsersManageList;
  }

  get isAllowedUserEval() {
    if (this.takeUserList && this.target && this.target.user_id !== this.$auth.user.id) {
      for (const userID of this.takeUserList) {
        if (userID !== parseInt(this.$auth.user.id)) {
          return true;
        }
      }
    }
    return false;
  }

  async getUsersManagedList() {
    try {
      await projectStore.getUserManaged();
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.responseMessage = err.response.data.message;
      } else {
        this.responseMessage = err.message;
      }
    }
  }

  // calculate points of project
  individualPoints(individual: Individual) {
    individual.points = this.calculatePoints(individual.weight, individual.completion_rate);
    return individual.points;
  }
  // calculate points of project
  projectPoints(project: Project) {
    project.points = this.calculatePoints(project.weight, project.superior_eval);
    return project.points;
  }

  // calculate points of challenge
  challengePoints(challenge: Challenge) {
    challenge.points = this.calculatePoints(challenge.weight, challenge.superior_eval);
    return challenge.points;
  }

  // calculate total weight
  get totalWeight() {
    let sumWeight = 0;
    for (const project of this.projectTarget) {
      if (project.weight !== null && Number.isInteger(project.weight)) {
        sumWeight += project.weight;
      }
    }
    for (const challenge of this.challenges) {
      if (challenge.weight !== null && Number.isInteger(challenge.weight)) {
        sumWeight += challenge.weight;
      }
    }

    for (const individual of this.individuals) {
      if (individual.weight !== null && Number.isInteger(individual.weight)) {
        sumWeight += individual.weight;
      }
    }

    if (this.common.weight && Number.isInteger(this.common.weight)) {
      this.result.weight = this.common.weight + sumWeight;
    }

    return this.result.weight;
  }

  // calculate total points
  get totalPoints() {
    let sumPoints = 0;
    for (const project of this.projectTarget) {
      if (project.points !== null) {
        sumPoints += project.points;
      }
    }
    for (const challenge of this.challenges) {
      if (challenge.points !== null) {
        sumPoints += challenge.points;
      }
    }
    for (const individual of this.individuals) {
      if (individual.points !== null) {
        sumPoints += individual.points;
      }
    }

    if (this.common.points) {
      this.result.points = parseFloat((this.common.points + sumPoints).toFixed(2));
    }
    return this.result.points;
  }

  // get current rank base on total point
  get takeCurrentRank() {
    const points = this.result.points;

    switch (true) {
    case points === 0:
      this.result.rank = 0;
      break;
    case points < 85:
      this.result.rank = 5;
      break;
    case points >= 85 && points < 95:
      this.result.rank = 4;
      break;
    case points >= 95 && points < 100:
      this.result.rank = 3;
      break;
    case points >= 100 && points < 110:
      this.result.rank = 2;
      break;
    default:
      this.result.rank = 1;
      break;
    }

    return this.result.rank ? this.EvaluationRankList.get(this.result.rank) : '';
  }

  // check whether disable input is allowed or not
  get checkAllowToEdit() {
    return targetStore.takeNotAllowToEdit;
  }

  // add a new individual target
  addIndividualRow(index: number) {
    this.individuals.splice(index + 1, 0, {
      weight           : null,
      item             : null,
      goal             : null,
      actual_eval      : null,
      completion_rate  : null,
      points           : null,
      placeholder      : null
    });
  }

  // add a new project target
  addRow(index: number) {
    this.projectTarget.splice(index + 1, 0, {
      id : null,
      action: '',
      self_assessment: null,
      superior_eval: null,
      points: null,
      weight: null
    });
  }

  // add a new project contribution
  addChallengeRow(index: number) {
    this.challenges.splice(index + 1, 0, {
      name: '',
      actions: '',
      self_assessment: null,
      superior_eval: null,
      points: null,
      weight: null
    });
  }

  isEditedForm(initForm : object, editedForm: object) : boolean {
    let initFormValues = initForm;
    let editedFormValues = editedForm;
    this.changeAllEmptyValueToNull(initFormValues);
    this.changeAllEmptyValueToNull(editedFormValues);
    initFormValues = Object.values(initFormValues).sort();
    editedFormValues = Object.values(editedFormValues).sort();
    return JSON.stringify(initFormValues) !== JSON.stringify(editedFormValues);
  }

  changeAllEmptyValueToNull(object : object) {
    for (const key in object) {
      if (typeof object[key] === 'object') {
        this.changeAllEmptyValueToNull(object[key]);
      }
      if (Array.isArray(object[key])) {
        object[key].map((item) => {
          this.changeAllEmptyValueToNull(item);
        });
      }
      object[key] = object[key] === '' ? null : object[key];
    }
  };

  handleReloadPage(event: any) {
    event.preventDefault();
    if (this.isEditedForm(this.initialForm, this.contentForm)) {
      event.returnValue = '';
      return;
    }
    window.removeEventListener('beforeunload', this.handleReloadPage, false);
  }

  // remove selected individual contribution
  removeIndividualRow(individualID: number) {
    const $this = this;
    if ($this.individuals.length === 1) {
      const msgTitle = $this.$tc('Notification');
      const msgModalConfirm = $this.$tc('This goal cannot delete');
      this.showMsgBoxOk(msgTitle, msgModalConfirm, function() {});
      return;
    }

    const msgModalConfirm = this.$tc('Do you want to DELETE this goal?')
      .replace('$1', '<font color="red"><strong>DELETE</strong></font>');
    this.showModalConfirm(this.$tc('Confirm delete'), msgModalConfirm, function() {
      $this.individuals.splice(individualID, 1);
    });
  }

  // remove selected project target
  removeRow(projectID: number) {
    const $this = this;
    if ($this.projectTarget.length === 1) {
      const msgTitle = $this.$tc('Notification');
      const msgModalConfirm = $this.$tc('This goal cannot delete');
      this.showMsgBoxOk(msgTitle, msgModalConfirm, function() {});
      return;
    }

    const msgModalConfirm = this.$tc('Do you want to DELETE this goal?')
      .replace('$1', '<font color="red"><strong>DELETE</strong></font>');
    this.showModalConfirm(this.$tc('Confirm delete'), msgModalConfirm, function() {
      $this.projectTarget.splice(projectID, 1);
    });
  }

  // remove selected project contribution
  removeChallengeRow(index: number) {
    const $this = this;
    if ($this.challenges.length === 1) {
      const msgTitle = $this.$tc('Notification');
      const msgModalConfirm = $this.$tc('This goal cannot delete');
      this.showMsgBoxOk(msgTitle, msgModalConfirm, function() {});
      return;
    }

    const msgModalConfirm = this.$tc('Do you want to DELETE this goal?')
      .replace('$1', '<font color="red"><strong>DELETE</strong></font>');
    this.showModalConfirm(this.$tc('Confirm delete'), msgModalConfirm, function() {
      $this.challenges.splice(index, 1);
    });
  }

  checkSelectedProject(projectID) {
    for (let i = 0; i < this.projectTarget.length; i++) {
      if (this.projectTarget[i].id === projectID) {
        return true;
      }
    }
    return false;
  }

  // change value to null when value = ''
  changeValueToNull(v) {
    return v === '' ? null : v;
  }

  changeQuarter() {
    if (this.projectTarget) {
      this.projectTarget.forEach((item) => {
        item.action = this.getTargetContentByQuarter(item.id, this.contentForm.year, this.contentForm.quarter);
      });
    }
  }

  getTargetContentByQuarter (projectID, year, quarter) {
    let target : string | null = null;
    const project = projectStore.takeProjectUserJoin && projectStore.takeProjectUserJoin.find(item => (
      item.project_id === projectID
    ));

    if (project && project.project_targets) {
      const targetObject = project.project_targets.find(proTarget => (
        (proTarget.year === year) && (proTarget.quarter === quarter)
      ));
      target = targetObject ? targetObject.content : '';
    }
    return target;
  }

  onChangeProject(even, index) {
    this.projectTarget[index].action = this.getTargetContentByQuarter(
      parseInt(even.target.value),
      this.contentForm.year,
      this.contentForm.quarter
    );
  }

  async handleSubmitTarget() {
    const observer: any = this.$refs.observer;
    const isValid = await observer.validate();
    const $this = this;
    if (this.result.weight !== 100) {
      const responseMessage = 'Weight must be equal 100';
      const $context = this;
      this.$common.makeToast($context, 'danger', 'b-toaster-bottom-right', 'Notification', responseMessage);
    } else if (isValid) {
      this.$nuxt.$loading.finish();

      if (this.targetContent.projects.length > 0) {
        for (const project of this.targetContent.projects) {
          if (project.id && project.id !== 0 && (!project.weight || (project.weight && project.weight === 0))) {
            const responseMessage = 'Please enter project\'s weight';
            const $context = this;
            this.$common.makeToast($context, 'danger', 'b-toaster-bottom-right', 'Notification', responseMessage);
            return;
          } else if ((!project.id || (project.id && project.id === 0)) && project.weight && project.weight !== 0) {
            const responseMessage = 'Please select a project';
            const $context = this;
            this.$common.makeToast($context, 'danger', 'b-toaster-bottom-right', 'Notification', responseMessage);
            return;
          }
        }
      }

      try {
        this.responseMessage = '';
        this.totalWeightErr = '';
        this.handleChangeValueToNull();

        if (!this.target || !this.isEvalExisted) {
          const res = await targetStore.createTarget({
            content: this.targetContent,
            year: this.contentForm.year,
            quarter: this.contentForm.quarter });

          this.showMsgBoxOk(this.$tc('Notification'), this.$tc(res.message), function() {
            $this.$emit('setIsEditedEval', false);
          });
        } else {
          const pramId = parseInt(this.pramId);
          const msg = this.$tc('Do you want to save this evaluation?');
          this.showModalConfirm(this.$tc('Confirmation'), msg, async () => {
            await targetStore.editTarget({
              ...$this.contentForm,
              eval_form_id: pramId,
              status: EvaluationCreatedStatus
            }).then((res) => {
              const msgEditRes = res.message;
              const $context = this;
              this.$common.makeToast($context, 'success', 'b-toaster-bottom-right', 'Notification', msgEditRes);

              $this.$emit('setIsEditedEval', false);
            });
          });
        }
      } catch (err) {
        if (typeof err.response !== 'undefined') {
          const responseMessage = err.response.data.message;
          const $context = this;
          this.$common.makeToast($context, 'danger', 'b-toaster-bottom-right', 'Notification', responseMessage);
        } else {
          const responseMessage = err.message;
          const $context = this;
          this.$common.makeToast($context, 'danger', 'b-toaster-bottom-right', 'Notification', responseMessage);
        }
      } finally {
        this.$nuxt.$loading.finish();
      }
    } else {
      const responseMessage = 'Some fields are wrong. Please check again!';
      const $context = this;
      this.$common.makeToast($context, 'danger', 'b-toaster-bottom-right', 'Notification', responseMessage);
    }
  }

  async handleSaveDraftTarget() {
    const observer: any = this.$refs.observer;
    const isValid = await observer.validate();
    const $this = this;

    if (this.result.weight !== 100) {
      this.responseMessage = 'Weight must be equal 100';
    } else if (isValid) {
      try {
        this.responseMessage = '';
        this.handleChangeValueToNull();
        const msg = 'Do you want to save this evaluation as draft? ';
        let status;
        let saveDraft;

        if (this.$props.isEvalSummitted) {
          this.responseMessage = 'Evaluation for this quarter is submitted. Cannot save draft!';
        } else {
          if (!this.isEvalExisted) {
            if (!this.target || this.isDuplicateEval) {
              status = EvaluationMemberIsCreatingStatus;
            } else if (this.target.status < EvaluationMemberIsEditingStatus && this.target.user_id === this.$auth.user.id) {
              status = EvaluationVNManagerIsReviewingStatus;
            }

            saveDraft = async function() {
              await targetStore.createTarget({
                content: $this.targetContent,
                year: $this.contentForm.year,
                quarter: $this.contentForm.quarter,
                status });
              $this.$emit('setIsEditedEval', false);
              await $this.$router.push('/evaluation/evaluation-list');
            };
          } else {
            if (this.target && this.target.user_id === this.$auth.user.id) {
              if (this.checkAllowToEdit && this.target.status < EvaluationMemberIsEditingStatus) {
                status = EvaluationMemberIsCreatingStatus;
              } else if (this.target.status < EvaluationVNManagerIsReviewingStatus) {
                status = EvaluationMemberIsEditingStatus;
              } else if (this.isAdmin) {
                status = EvaluationVNManagerIsReviewingStatus;
              }
            }

            saveDraft = async function() {
              await targetStore.editTarget({
                ...$this.contentForm,
                eval_form_id: parseInt($this.pramId) ? parseInt($this.pramId) : targetStore.evalID,
                status
              });
              $this.$emit('setIsEditedEval', false);
              await $this.$router.push('/evaluation/evaluation-list');
            };
          }
          this.showModalConfirm('Save Draft', msg, saveDraft);
          this.$nuxt.$loading.finish();
        }
      } catch (err) {
        if (typeof err.response !== 'undefined') {
          this.responseMessage = err.response.data.message;
        } else {
          this.responseMessage = err;
        }
      }
    } else {
      this.responseMessage = 'Some fields are wrong. Please check again!';
    }
  }

  duplicateEval() {
    targetStore.setDuplicateEval(true);
    targetStore.setEvalID(parseInt(this.$route.params.id));
    this.$router.push('/evaluation/create-eval-user');
  }

  closeForm() {
    this.$emit('setIsEditedEval', false);
    if (this.iscreate) {
      this.$router.push('/evaluation/evaluation-list');
    } else {
      this.$router.back();
    }
  }

  closeFormView() {
    window.close();
  }

  editTarget() {
    this.$router.push('/evaluation/edit-eval-user/' + this.pramId);
  }

  base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  async exportExcel() {
    try {
      const response: ExportEvaluationExcel[] = await evaluationStore.exportToExcel([parseInt(this.pramId)]);
      for (const res of response) {
        const byteArray = this.base64ToArrayBuffer(res.buf);
        const link = document.createElement('a');
        const filename = `${res.file_name.replace(/\s/g, '')}.xlsx`;
        link.href = window.URL.createObjectURL(
          new Blob(
            [byteArray],
            { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
          ));
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.responseMessage = err.response.data.message;
      } else {
        this.responseMessage = err.message;
      }
    }
  }

  handleChangeValueToNull() {
    for (const project of this.projectTarget) {
      project.self_assessment = this.changeValueToNull(project.self_assessment);
    }
    this.common.actual_eval = this.changeValueToNull(this.common.actual_eval);
  }

  calculatePoints(weight: number | null, completion_rate: number | null) {
    let result = 0;
    weight = this.changeValueToNull(weight);
    completion_rate = this.changeValueToNull(completion_rate);

    if (weight !== null && completion_rate !== null) {
      result =  parseFloat((weight * completion_rate / 100).toFixed(2));
    }
    return result;
  }

  takeGoalRate(individual: Individual) {
    if (individual.actual_eval !== null && individual.goal) {
      individual.completion_rate = parseFloat((individual.actual_eval / individual.goal * 100).toFixed(2));
    }

    return individual.completion_rate;
  }

  goToCreateEval() {
    this.$router.push('/evaluation/create-eval-user');
  }

  goToMemberEval() {
    this.$router.push('/evaluation/evaluation-list');
  }

  showModalConfirm(title: string, message: string, callBack: Function) {
    const messageNodes = this.$createElement(
      'div',
      {
        domProps: { innerHTML: message }
      }
    );

    this.$bvModal.msgBoxConfirm([messageNodes], {
      title,
      buttonSize      : 'md',
      okVariant       : 'primary',
      okTitle         : 'OK',
      hideHeaderClose : true,
      centered        : true,
      cancelTitle     : this.$t('Cancel') as string
    }).then((value: any) => {
      if (value) {
        callBack();
      }
    });
  }

  showMsgBoxOk(title: string, message: string, callBack: Function) {
    const messageNodes = this.$createElement(
      'div',
      {
        domProps: { innerHTML: message }
      }
    );
    this.$bvModal.msgBoxOk([messageNodes], {
      title           : title,
      buttonSize      : 'md',
      okVariant       : 'primary',
      okTitle         : 'OK',
      hideHeaderClose : true,
      centered        : true
    }).then((value: any) => {
      if (value) {
        callBack();
      }
    });
  }
};
</script>
<style scoped>
.card-style {
  border: 2px solid #EBEFF2 !important;
  border-radius: 12px;
  box-shadow: none;
  outline: none;
}
.border-right {
  border-right: 1px solid #ececec;
}
table {
  margin-bottom: 0;
}
table.table-target > thead > th {
  vertical-align: middle;
}
table.table-striped > tbody > tr > td {
  vertical-align: middle;
  height: 70px;
}
.table-head {
  font-weight: 600;
}
.table-eval th, .table-eval td {
  padding: 10px;
  border-right: 1px solid !important;
  border-right-color: #EBEFF2 !important;
}
.row-position {
  position: relative;
}
.card-head-position {
  position: absolute;
  width: 100%;
  left: 0;
}
.input-position {
  position: sticky;
  width: 100%;
}
textarea {
  resize: none;
}
.textarea-height {
  height: 38px;
}
.border-wrap {
  border-radius: 8px 8px 0 0;
}
.border-bottom-none {
  border-bottom: 0;
}
.required:after {
  content: " *";
  color:red;
}
.card-header-evaluation {
  position: relative;
  height: 55px;
  cursor: pointer;
}
.title-head{
  position: absolute;
  left: 20px;
  top: 13px;
}
.delete-btn{
  position: absolute;
  opacity: 0;
  top: 0;
  right: 0;
  transform: translate(67%, 15%);
  transition: all 0.2s ease;
}
.delete-btn > button {
  border-radius: 0;
  width: 30px;
  height: 30px;
}
.delete-btn > button:nth-child(1) {
  background-color: #40d900;
}
.delete-btn > button:nth-child(2) {
  background-color: #c94c4c;
}
.row-position:hover .delete-btn {
  opacity: 1;
}
.total {
  padding: 32px;
}
div.card-header-evaluation.collapsed .when-opened,
div.card-header-evaluation:not(.collapsed) .when-closed {
  display: none;
}
::-webkit-input-placeholder { /* Edge */
  color: #9F9F9F;
  opacity: 0.8;
}
:-ms-input-placeholder { /* Internet Explorer */
  color: #9F9F9F;
  opacity: 0.8;
}
::placeholder {
  color: #9F9F9F;
  opacity: 0.8;
}
.input-eval {
  text-align: center;
}
.input-project-eval {
  text-align: center;
}
.rectangle {
  width: 13px;
  height: 13px;
  border-radius: 50%;
  position: relative;
}
.rectangle:before {
  content: ' ';
  height: 8px;
  width: 8px;
  border-radius: 50%;
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(-33%, 32%);
  background-color: #fff;
  z-index: 9;
}
.no-bg-color {
  background-color: #fff !important;
}
pre {
  font-family: inherit;
  font-size: inherit;
  margin-bottom: 0;
  overflow: hidden;
  font-weight: 600 !important;
}
th > span, .font-bold{
  font-weight: 600 !important;
}
.was-validated .form-control:invalid:focus, .form-control.is-invalid:focus, .form-control:focus {
    box-shadow: 0 0 0 0 #fff;
}
.option-selected-bg{
  background-color: rgb(170, 170, 170);
}
.year-quarter-select {
  display: flex;
  flex-direction: row;
}
.wrap-content {
  display: flex;
  flex-direction: row;
}
.wrap-content-left {
  width: 60%;
}
.wrap-content-right {
  width: 40%;
}
.year-quarter-select .form-group {
  width: 50%;
}
.user-input-color {
  background-color: #14DEBA;
}
.superior-input-color {
  background-color: #FFB946;
}
.bg-color-user-eval {
  background-color: #14DEBA;
}
.bg-color-admin-eval {
  background-color: #FFB946;
}
.bg-text-read-only {
  background-color: #e9ecef !important;
}
.year-quarter-select .form-group {
  width: 100%;
}
.height-45px {
  height: 45px !important;
}
@media (min-width: 1601px) {
  .head-target-weight {
    width: 150px;
  }
  .head-target-name {
    width: 600px;
  }
  .head-target-eval {
    width: 150px;
  }
}
@media (min-width: 1281px) {
  .user-eval-1 > .eval-weight-grades {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .user-content-info {
    display: flex;
    flex-direction: row;
  }
  .user-info {
    width: 40%;
  }
  .user-eval-info {
    width: 60%;
    display: flex;
    flex-direction: row;
  }
  .user-eval-1 {
    width: 60%;
  }
  .user-eval-1 > .eval-weight-grades {
    display: flex;
    justify-content: center;
  }
  .user-eval-1 span {
    width: 100%;
  }
  .user-eval-2 {
    width: 40%;
  }
}
@media (min-width: 767px) and (max-width: 1280px) {
  .wrap-content {
    display: flex;
    flex-direction: column;
  }
  .wrap-content-left,
  .wrap-content-right {
    width: 100%;
  }
  .user-content-info {
    display: flex;
    flex-direction: row;
    padding: 10px 0;
    border-bottom: 1px solid #EBEFF2;
  }
  .user-info {
    width: 40%;
  }
  .user-eval-info {
    width: 60%;
    display: flex;
    flex-direction: row;
  }
  .user-eval-1 {
    width: 60%;
  }
  .user-eval-1 > .eval-weight-grades {
    display: flex;
    flex-direction: column;
  }
  .user-eval-2 {
    width: 40%;
  }
  .head-target-weight {
    min-width: 150px;
  }
  .head-target-name {
    min-width: 300px;
  }
  .head-target-eval {
    min-width: 150px;
  }
  .overflow-x {
    overflow-x: auto;
  }
}
@media (min-width: 320px) and (max-width: 766px) {
  .wrap-content {
    display: flex;
    flex-direction: column;
  }
  .wrap-content-left,
  .wrap-content-right {
    width: 100%;
  }
  .user-content-info {
    display: flex;
    flex-direction: column;
  }
  .user-eval-info {
    display: flex;
    flex-direction: row;
    padding: 10px 0;
    border-bottom: 1px solid #EBEFF2;
  }
  .user-info {
    width: 100%;
    padding: 10px 0;
    border-bottom: 1px solid #EBEFF2;
  }
  .user-eval-1 {
    width: 55%;
  }
  .user-eval-1 > .eval-weight-grades {
    display: flex;
    flex-direction: column;
  }
  .user-eval-1 span {
    width: 100%;
  }
  .user-eval-2 {
    width: 45%;
  }
  .head-target-weight {
    min-width: 100px;
  }
  .head-target-name {
    min-width: 200px;
  }
  .head-target-eval {
    min-width: 100px;
  }
  .overflow-x {
    overflow-x: auto;
  }
}
</style>
