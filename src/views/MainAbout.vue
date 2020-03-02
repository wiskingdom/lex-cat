<template>
  <div class="col q-gutter-md" style="padding: 10px 20px;">
    <p></p>
    <p>
      <a :href="guide.path" download> {{ guide.name }} 다운로드</a>
    </p>
  </div>
</template>

<style></style>

<script>
import { mapState } from 'vuex';
export default {
  name: 'MainAbout',
  computed: {
    ...mapState(['guide']),
  },
};
</script>
