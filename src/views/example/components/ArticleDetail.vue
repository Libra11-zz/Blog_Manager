<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <el-button
        v-loading="loading"
        style="float: right;margin-top: 10px; margin-right: 10px"
        type="success"
        @click="submitForm"
      >Publish</el-button>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="name" required>Title</MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item
                    label-width="60px"
                    label="Author:"
                    prop="author"
                    class="postInfo-container-item"
                  >
                    <el-select
                      v-model="postForm.author"
                      :remote-method="getRemoteUserList"
                      filterable
                      default-first-option
                      remote
                      placeholder="Search user"
                    >
                      <el-option
                        v-for="(item,index) in userListOptions"
                        :key="item+index"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label-width="60px"
                    label="Tag:"
                    prop="tag"
                    class="postInfo-container-item"
                  >
                    <el-input v-model="postForm.tag" placeholder="Please input tag" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label-width="70px"
                    label="Category:"
                    prop="category"
                    class="postInfo-container-item"
                  >
                    <el-input v-model="postForm.category" placeholder="Please input category" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item label-width="75px" label="Summary:">
          <el-input
            v-model="postForm.content_short"
            :rows="1"
            type="textarea"
            class="article-textarea"
            autosize
            placeholder="Please enter the content"
          />
          <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}words</span>
        </el-form-item>
        <el-form-item label-width="75px" label="ImageURL:">
          <el-input
            v-model="postForm.image_uri"
            :rows="1"
            type="textarea"
            class="article-textarea"
            autosize
            placeholder="Please enter the imageURL"
          />
        </el-form-item>
        <div class="components-container">
          <div class="editor-container">
            <el-tag class="tag-title">Content:</el-tag>
            <markdown-editor v-model="postForm.content" height="1000px" />
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import MDinput from '@/components/MDinput'
import { searchUser } from '@/api/remote-search'
import { addBlogs } from '@/api/blogs'
import MarkdownEditor from '@/components/MarkdownEditor'

const defaultForm = {
  title: '', // 文章题目
  content: '', // 文章内容
  tag: '',
  category: '',
  content_short: '', // 文章摘要
  image_uri: '', // 文章图片
  pubTime: new Date().getTime(),
  upTime: new Date().getTime()
}
export default {
  name: 'ArticleDetail',
  components: { MDinput, MarkdownEditor },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
        tag: [{ validator: validateRequire }],
        category: [{ validator: validateRequire }]
      },
      tempRoute: {},
      content: ''
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.content_short.length
    }
  },
  created() {
    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    submitForm() {
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          addBlogs(this.postForm).then(response => {
            console.log(response)
          })
          this.$notify({
            title: '成功',
            message: '发布文章成功',
            type: 'success',
            duration: 2000
          })
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getRemoteUserList() {
      searchUser().then(response => {
        console.log(response)
        if (!response.info.length) return
        this.userListOptions = response.info.map(v => v.userName)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
.components-container {
  margin: 30px 0;
  .editor-container {
    margin-bottom: 30px;
  }
  .tag-title {
    margin-bottom: 5px;
  }
}
</style>
