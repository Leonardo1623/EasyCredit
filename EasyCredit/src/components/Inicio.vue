<template>
  <div>
    <md-toolbar class="md-primary" md-elevation="1">
      <h3 class="md-title" style="flex: 1">EasyCredit</h3>
      <md-button @click="obtenerHistorial()">Actualizar</md-button>
      <md-button @click="cerrarSesion()">Cerrar sesión</md-button>
    </md-toolbar>
    <div class="saludo">
      <h1>{{ msg + usuario }}</h1>
    </div>
    <div class="container">
      <div class="container-wrapper md-layout-row">
        <md-card md-with-hover>
          <md-card-header>
            <div class="md-title"> Perfil </div>
          </md-card-header>

          <md-card-content >
            <h4>Usuario: {{usuario}}</h4>
            <ul id="example-1" style="height: 208px; overflow-y: auto">
                <li v-for="(item, index) in solicitudes" :key="index" v-if="item.status === 2">
                  <h4 v-if="item.status === 1">{{'ID: '+ item.id + ' - Monto $'+item.amount}} Aceptada </h4>
                  <h4 v-else-if="item.status === 2">{{'ID: '+ item.id + ' - Monto $'+item.amount}} Pendiente </h4>
                  <h4 v-else-if="item.status === 3">{{'ID: '+ item.id + ' - Monto $'+item.amount}} Rechazada </h4>
                </li>
              </ul>
          </md-card-content>
        </md-card>

        <md-card md-with-hover>
            <md-card-header>
              <div class="md-title"> Historial Crediticio </div>
            </md-card-header>

            <md-card-content style="height: 287px; overflow-y: auto">
              <ul id="example-1">
                <li v-for="(item, index) in solicitudes" :key="index">
                  <h4 v-if="item.status === 1">{{'ID: '+ item.id + ' - Monto $'+item.amount}} Aceptada </h4>
                  <h4 v-else-if="item.status === 2">{{'ID: '+ item.id + ' - Monto $'+item.amount}} Pendiente </h4>
                  <h4 v-else-if="item.status === 3">{{'ID: '+ item.id + ' - Monto $'+item.amount}} Rechazada </h4>
                </li>
              </ul>
            </md-card-content>

            <md-card-actions>
            </md-card-actions>
        </md-card>

        <md-card md-with-hover>
          <md-card-header>
            <div class="md-title"> Solicitudes </div>
          </md-card-header>
          <md-card-content style="height: 250px; overflow-y: auto">
            <ul id="example-1">
              <li v-for="(item, index) in solicitudes" :key="index" v-if="item.status === 2">
                {{'ID: '+ item.id + ' - Monto $'+item.amount +' - '+ item.payments +' Pagos - Pendiente'}}
              </li>
            </ul>
          </md-card-content>

          <md-card-actions>
            <md-button class="md-primary md-raised" @click="showDialog = true">Nueva solicitud</md-button>
            <md-dialog class="md-layout md-gutter md-alignment-center-center" :md-active.sync="showDialog">
              <md-dialog-title>Nueva solicitud</md-dialog-title>
                <md-field >
                  <label for="monto">Monto a solicitar</label>
                  <md-input name="monto" id="monto" type="number" autocomplete="given-name" v-model="form.monto" />
                </md-field>
                <md-field >
                  <label for="edad">Edad</label>
                  <md-input name="edad" id="edad" type="number" autocomplete="given-name" v-model="form.edad"/>
                </md-field>
                <md-checkbox v-model="form.tcredito" true-value="true" false-value="false" >Tarjeta de crédito</md-checkbox>
                <md-field>
                  <label for="movie">Plazo (pagos)</label>
                  <md-select v-model="form.plazo" name="plazo" id="plazo" @md-selected="onChangePayment()">
                    <md-option value="3">3 pagos - 5% de interés</md-option>
                    <md-option value="6">6 pagos - 7% de interés</md-option>
                    <md-option value="9">9 pagos - 12% de interés</md-option>
                  </md-select>
                </md-field>
                <md-field >
                  <label for="monto">Total a pagar</label>
                  <md-input name="total" type="number" id="total" autocomplete="given-name" v-model="form.total" disabled />
                </md-field>
                <md-dialog-actions>
                  <md-button class="md-primary" @click=" showDialog = false">Cancelar</md-button>
                  <md-button type="submit"  class="md-primary" @click="registraSolicitud(), showDialog = false">Solicitar</md-button>
                </md-dialog-actions>
            </md-dialog>
          </md-card-actions>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import {
  required
} from 'vuelidate/lib/validators'
import axios from 'axios'
export default {
  name: 'Inicio',
  data: () => ({
    msg: 'Bienvenido de nuevo ',
    usuario: '',
    estadoSolicitud: 'Sin solicitudes',
    serie: 'SC',
    idsolicitud: '1',
    iduser: 0,
    meses: 3,
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ],
    solicitudes: [],
    showDialog: false,
    form: {
      monto: null,
      edad: null,
      tcredito: false,
      plazo: 1,
      total: 0
    }
  }),
  created () {
  // Se cargan las variables de nombre y idusuario al mostrar la vista
    let usr = JSON.parse(JSON.stringify(this.$route.params))
    this.iduser = usr.iduser
    this.usuario = usr.nombre
  },
  validations: {
    form: {
      monto: {
        required
      },
      edad: {
        required
      }
    }
  },
  mounted () {
    this.registraSolicitud()
    this.obtenerHistorial()
  },
  methods: {
    cerrarSesion () {
      this.$router.go(-1)
    },
    // Función que realiza una petición al recurso historial para insertar la petición
    async registraSolicitud () {
      let params = {iduser: this.iduser, monto: `${this.form.monto}`, edad: `${this.form.edad}`, tcredito: `${this.form.tcredito}`, plazo: `${this.form.plazo}`}
      let response = null
      try {
        if ((params !== 'undefined') && (params !== 'null') && (params.monto !== 'null')) {
          response = await axios.post('http://localhost:3000/api/v1/historial', {
            data: JSON.stringify(params)
          })
        } else {
          response = null
        }
        this.form.monto = null
        this.form.edad = null
        this.form.tcredito = false
        this.form.plazo = 1
        this.form.total = null
        this.obtenerHistorial()
      } catch (e) {
        console.log(e.message)
      }
    },
    // Función que realiza una petición al recurso historial para obtener historial crediticio
    async obtenerHistorial () {
      let response = null
      try {
        if ((this.iduser !== 'undefined') && (this.iduser !== 'null') && (this.iduser !== 0)) {
          response = await axios.get('http://localhost:3000/api/v1/historial?iduser=' + this.iduser, {
          })
          this.solicitudes = response.data.Respuesta
        } else {
          response = null
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
      this.form.monto = null
      this.form.edad = null
      this.form.tcredito = null
      this.form.plazo = null
    },
    saveSolicitud () {
      this.sending = true
      this.registraSolicitud()
    },
    validateSolicitud () {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.saveSolicitud()
      }
    },
    onChangePayment () {
      switch (this.form.plazo) {
        case '3': this.form.total = (this.form.monto * 0.05 + Number(this.form.monto)); break
        case '6': this.form.total = (this.form.monto * 0.07 + Number(this.form.monto)); break
        case '9': this.form.total = (this.form.monto * 0.12 + Number(this.form.monto)); break
        default: this.form.total = 0; break
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .md-card {
    width: 320px;
    margin: 4px;
    display: inline-block;
    vertical-align: top;
  }
  .saludo{
    text-align: center;
    min-height: 100%;
    padding-top: 30px;
    display: -webkit-box;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    font-family: Roboto Mono,monospace;
    transition: .4s cubic-bezier(.4,0,.2,1);
    transition-property: padding-top;
  }
  .container{
    text-align: center;
    min-height: 100%;
    padding-top: 60px;
    display: -webkit-box;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    font-family: Roboto Mono,monospace;
    transition: .4s cubic-bezier(.4,0,.2,1);
    transition-property: padding-top;
  }
  .md-dialog {
    min-height: 50%;
    min-width: 25%;
    padding-top: 64px;
    display: -webkit-box;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
  }
  .container-modal{
    width: 100%;
  }
  .md-checkbox {
    display: flex;
  }
  .md-toolbar + .md-toolbar {
    margin-top: 16px;
  }
</style>
