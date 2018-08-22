<template>
  <div class="container">
    <div class="saludo">
      <h1>{{ msg  }}</h1>
    </div>
    <div >
      <form novalidate class="md-layout md-gutter md-alignment-center-center" @submit.prevent="validateUser" >
        <md-card class="md-layout-item md-size-35 md-small-size-100">
          <md-card-header>
            <div class="md-title">Inicie sesión</div>
          </md-card-header>

          <md-card-content>
            <div class="md-layout md-gutter">
              <div class="md-layout-item md-small-size-100">
                <md-field :class="getValidationClass('usuario')">
                  <label for="first-name">Nombre de usuario</label>
                  <md-input name="usuario" id="usuario" autocomplete="given-name" v-model="form.usuario" :disabled="sending" />
                  <span class="md-error" style="color:red" v-if="!$v.form.usuario.required">El nombre de usuario es requerido</span>
                </md-field>
              </div>
            </div>
          </md-card-content>

          <md-progress-bar md-mode="indeterminate" v-if="sending" />

          <md-card-actions>
            <md-button type="submit" class="md-primary md-raised" :disabled="sending">Iniciar</md-button>
          </md-card-actions>
        </md-card>
      </form>
    </div>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import {
  required,
  minLength
} from 'vuelidate/lib/validators'
// import LoginService from '@/servicio/LoginService'
import axios from 'axios'
export default {
  name: 'login',
  mixins: [validationMixin],
  data: () => ({
    form: {
      usuario: null
    },
    userSaved: false,
    sending: false,
    usuario: null,
    msg: 'Bienvenido a EasyCredit',
    k: []
  }),
  validations: {
    form: {
      usuario: {
        required,
        minLength: minLength(3)
      }
    }
  },
  mounted () {
    this.login()
  },
  methods: {
      //Función que realiza la petición al recurso de usuarios de la API
    async login () {
      let params = `${this.form.usuario}`
      let response = null
      try {
        if ((params !== 'undefined') && (params !== 'null')) {
          response = await axios.post('http://localhost:3000/api/v1/users', {
            data: JSON.stringify({username: params})
          })
        } else {
          response = null
        }
        if (response.data.iduser !== null) {
          //De ser correcto el logeo o registro, cambiamos la vista de la aplicación
          this.$router.push({name: 'Inicio', params: {iduser: response.data.iduser, nombre: this.form.usuario}})
        }
      } catch (e) {
        console.log(e.message)
      }
    },
    getValidationClass (fieldName) {
      const field = this.$v.form[fieldName]

      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        }
      }
    },
    clearForm () {
      this.$v.$reset()
      this.form.usuario = null
    },
    saveUser () {
      this.sending = true

      // Instead of this timeout, here you can call your API
      window.setTimeout(() => {
        this.login()
        this.usuario = `${this.form.usuario}`
        this.userSaved = true
        this.sending = false
      }, 1500)
    },
    validateUser () {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.saveUser()
      }
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
 .saludo{
    text-align: center;
    padding-bottom: 40px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    font-family: Roboto Mono,monospace;
  }
.container{
   text-align: center;
    min-height: 100%;
    padding-top: 64px;
    display: -webkit-box;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    font-family: Roboto Mono,monospace;
    transition: .4s cubic-bezier(.4,0,.2,1);
    transition-property: padding-top;
  }
</style>
