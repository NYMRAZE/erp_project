<template>
  <div class="chat-container">
    <div class="chat">
      <div class="chat-header clearfix">
        <div class="chat-about d-flex justify-content-between align-items-center">
          <div class="chat-title">{{ $t('Comment CV') }}</div>
          <button type="button" class="close mb-1" @click="close()">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </div>
      <!-- end chat-header -->
      <div ref="chatHistory" class="chat-history" :class="cvComments.length && 'chat-list'">
        <ul>
          <li v-for="(item, index) in cvComments" :id="'comment-' + item.id" :key="index">
            <div class="message-wrap">
              <div class="message-data" :class="item.created_by === userID && 'd-flex flex-row-reverse'">
                <span class="message-data-name font-weight-bold">{{ getUserByID(item.created_by) }}</span>
                <span class="message-data-time mr-2">{{ item.updated_at ? item.created_at : item.updated_at }}</span>
              </div>
              <div>
                <div class="message my-message" :class="item.id === commentID && 'noti-comment'">
                  <textarea
                    v-model="item.comment"
                    v-autosize
                    class="form-control border-none text-white"
                    :readonly="!item.isEdit && item.created_by !== userID"
                    @click="enableEditComment(index, item.created_by)" />
                </div>
                <div
                  v-if="item.isEdit && item.created_by === userID"
                  class="d-flex align-items-center message-action ml-2">
                  -<a class="mr-1" href="#" @click="handleEditComment(item.comment, item.id, index)">{{ $t('Save') }}</a>
                  -<a href="#" @click="removeCvComment(item.id, index)">{{ $t('Delete') }}</a>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <!-- end chat-history -->

      <div class="chat-message clearfix">
        <textarea
          v-model="cvComment"
          v-autosize
          class="form-control"
          :placeholder="$t('Type your comment')"
          rows="3">
        </textarea>
        <i class="fa fa-file-o"></i> &nbsp;&nbsp;&nbsp;
        <i class="fa fa-file-image-o"></i>
        <button @click="createCvComment">{{ $t('Send') }}</button>
      </div>
      <!-- end chat-message -->
    </div>
  </div>
  <!-- end chat -->
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import { recruitmentStore } from '~/store';
import { CVComments } from '~/types/recruitment';

@Component({
  components: {
  }
})
export default class extends Vue {
  @Prop() cvId ?: number
  userID: number = this.$auth.user.id
  cvComment: string = ''
  recruitmentId: number = 0
  errResponse: string = ''
  cvComments: CVComments[] = this.commentArr
  commentID: number = 0
  commentIndex: number = 0
  editCommentIndex: number = -1
  createBy: number = 0

  beforeMount() {
    const query = this.$route.query;
    this.recruitmentId = parseInt(query.recruitment_id.toString());
    this.commentID = query.comment_id ? parseInt(query.comment_id.toString()) : 0;
  }

  mounted() {
    const $this = this;
    setTimeout(function() {
      if ($this.commentID) {
        const commentIndex = $this.commentID;
        const commentElement = (document.getElementById('comment-' + commentIndex) as any);
        if (commentElement) {
          commentElement.scrollIntoView();
        }
      }
    }, 100);
  }

  get takeCVComments() {
    return recruitmentStore.takeCVComments;
  }

  get commentArr() {
    let newArray : CVComments[] | [] = [];

    if (this.takeCVComments) {
      this.takeCVComments.forEach((value) => {
        const item: CVComments = Object.assign({}, value);
        newArray = [ ...newArray, { ...item, isEdit: false } ];
      });
    }

    return newArray;
  }

  get takeUsers() {
    return recruitmentStore.takeUsers;
  }

  enableEditComment(index: number, created_by: number) {
    if (created_by === this.userID && !this.cvComments[index].isEdit) {
      this.editCommentIndex = index;
      this.cvComments[index].isEdit = true;
    }
  }

  disableEditComment() {
    if (this.cvComments[this.editCommentIndex].isEdit) {
      this.cvComments[this.editCommentIndex].isEdit = false;
      this.editCommentIndex = -1;
    }
  }

  async handleEditComment(comment: string, id: number, index: number) {
    try {
      await recruitmentStore.editCvComment({
        id,
        comment
      });
      this.cvComments[index].isEdit = false;
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errResponse = err.response.data.message;
      } else {
        this.errResponse = err.message;
      }
    }
  }

  async removeCvComment(id: number, index: number) {
    try {
      await recruitmentStore.removeCvComment({
        recruitment_id: this.recruitmentId,
        id
      });
      this.cvComments.splice(index, 1);
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errResponse = err.response.data.message;
      } else {
        this.errResponse = err.message;
      }
    }
  }

  disableEdit(index: number) {
    this.cvComments[index].isEdit = false;
  }

  async close() {
    try {
      await this.$router.replace(`/recruitment/manage-cv?recruitment_id=${this.recruitmentId}`);
      recruitmentStore.setShowCVComments(false);
    } catch (e) {
    }
  }

  async getCVComments () {
    try {
      await recruitmentStore.getCvComments({
        recruitment_id: this.recruitmentId,
        cv_id: this.cvId
      });
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errResponse = err.response.data.message;
      } else {
        this.errResponse = err.message;
      }
    }
  }

  getUserByID(key: number) {
    return this.takeUsers.get(key.toString());
  }

  async createCvComment() {
    try {
      if (this.cvComment) {
        await recruitmentStore.createCvComment({
          recruitment_id: this.recruitmentId,
          cv_id: this.cvId,
          comment: this.cvComment
        });
        this.cvComment = '';
        await this.getCVComments();
        this.cvComments =  this.commentArr;
      }
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errResponse = err.response.data.message;
      } else {
        this.errResponse = err.message;
      }
    }
  }
}
</script>
<style scoped>
.chat-container {
  z-index: 3;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  transition: opacity 500ms;
}
ul li {
  list-style-type: none;
}
.chat-container:target {
  visibility: visible;
  opacity: 1;
}
.chat {
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
  width: 490px;
  float: left;
  background: #f2f5f8;
  border-radius: 5px;
  color: #434651;
}
.chat-title {
  font-size: 22px;
}
.chat .chat-header {
  padding: 20px;
  border-bottom: 2px solid white;
}
.chat-list {
  padding: 30px 30px 20px;
  overflow-y: scroll;
}
.chat .chat-history {
  border-bottom: 2px solid white;
  max-height: 570px;
}
.chat .chat-history .message-data-time {
  color: #a8aab1;
  padding-left: 6px;
}
.chat .chat-history .message-data {
  margin-bottom: 15px;
}
.chat .chat-history .message {
  color: white;
  padding: 10px 20px;
  line-height: 26px;
  font-size: 16px;
  border-radius: 7px;
  margin-bottom: 5px;
  position: relative;
}
.message-wrap {
  width: 90%;
}
.chat .chat-history .my-message {
  background: #979fa7;
}
.my-message textarea {
  resize: none;
  background-color: inherit;
  border: none;
}
.chat .chat-message {
  padding: 0 30px 30px 30px;
}
.chat .chat-message textarea {
  padding: 10px 20px;
  font: 14px/22px "Lato", Arial, sans-serif;
  margin-bottom: 10px;
  border-radius: 5px;
  resize: none;
}
 .chat .chat-message button {
  float: right;
  font-size: 16px;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  font-weight: bold;
  color: #2188e8;
  outline: none;
}
 .chat .chat-message button:hover {
  color: #75b1e8;
}
.message-action a {
  color: #5e6c84;
  font-size: 12px;
}
.noti-comment {
  background-color: #94C2ED !important;
}
@media (max-width: 768px) {
  .chat {
    width: 320px !important;
  }
  .chat-history {
    max-height: 370px !important;
  }
  .chat .chat-history .message {
    width: 100%;
  }
}
</style>
