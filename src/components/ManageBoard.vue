<template>
  <div>
    <el-card>
      <Comment :comments="commentData"></Comment>
    </el-card>
  </div>
</template>

<script>
import {comments} from '@/components/widgets/comment/mock/mockdata'
import Comment from './widgets/comment/Comment'
export default {
  name: "ManageBoard",
  components: {
    Comment
  },
  data() {
    return {
      currentDate: new Date(),
      commentData: [],
      group: [
        {
          name: '林宇航',
          avatar: 'https://avatars.githubusercontent.com/u/30885631?v=4',
          sid: '200327140',
          github: 'https://github.com/YHCClin'
        },
        {
          name: '郑西坤',
          sid: '200327140',
          avatar: 'https://avatars.githubusercontent.com/u/30885631?v=4',
          github: 'https://github.com/YHCClin'
        },
        {
          name: '郑佳晨',
          sid: '200327140',
          avatar: 'https://avatars.githubusercontent.com/u/30885631?v=4',
          github: 'https://github.com/YHCClin'
        },
        {
          name: '郑超凡',
          sid: '200327119',
          avatar: 'https://avatars.githubusercontent.com/u/30885631?v=4',
          github: 'https://github.com/YHCClin'
        }
      ]
    }
  },
  created() {
    this.commentData = comments.data
  }
}
</script>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  position: relative;
  width: 100%;
}
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.group {
  font-size: 50px;
  margin: 30px;
}
</style>
