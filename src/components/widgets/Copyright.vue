<template>
<div>
  <div class="icp-info">
    <span>{{copyright_info.copyright}} {{copyright_info.year}} | </span>
    <span><a href="https://beian.miit.gov.cn/">{{copyright_info.location}}ICP备 {{ copyright_info.icp }}</a></span><span> | {{copyright_info.location}}公安网备 {{copyright_info.gaw}} </span>
  </div>
</div>
</template>

<script>
import {getRequest} from "@/utils/api";

export default {
  name: "Copyright",
  data() {
    return {
      copyright_info: {
        location: '闽',
        icp: '2021005833',
        gaw: '123456',
        copyright: 'Copyright © 2021 ~ ',
        year: ''
      }
    }
  },
  methods: {
    getCopyrightInfo() {
      this.copyright_info.year = new Date().getFullYear()
      getRequest().then(resp => {

      })
    }
  },
  created() {
    this.getCopyrightInfo()
  }
}
</script>

<style scoped>
.icp-info {
  position: fixed;
  bottom: 0;
  font-size: 14px;
  height: 20px;
  width: 100%;
  line-height: 20px;
  text-align: center;
  color: #505458;
}
</style>
