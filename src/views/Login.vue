<template>
  <div id="login" class="q-ma-md">
    <h5 class="login-title text-center">LOGIN</h5>
    <div class="q-gutter-md">
      <div class="row justify-center">
        <div class="col-md-5">
          <q-input outlined type="email" label="Email" v-model="user.email" />
        </div>
      </div>
      <div class="row justify-center">
        <div class="col-md-5">
          <q-input
            outlined
            type="password"
            label="Password"
            v-model="user.password"
            @keyup.enter="login"
          />
        </div>
      </div>
    </div>
    <div class="q-gutter-md text-center" style="margin-top: 30px">
      <q-btn color="primary" @click="login" label="Login" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      // information only for this component.
      user: {
        email: '',
        password: '',
      },
    };
  },
  methods: {
    login() {
      this.$auth
        .signInWithEmailAndPassword(this.user.email, this.user.password)
        .then(() => {
          this.$router.push('main');
        })
        .catch(err => {
          this.$q.dialog({
            title: 'Error',
            message: `${err.message}`,
          });
        });
      this.loading = false;
    },
  },
  created() {
    this.$auth.signOut();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
