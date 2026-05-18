const { withNativeFederation } = require('@angular-architects/native-federation/config');
const { sharedConfig } = require('../../shared-federation.config');

module.exports = withNativeFederation({
  name: 'seis-mfe-dashboard-facturas',

  exposes: {
    './DashboardFacturasRoutingModule': 'projects/seis-mfe-dashboard-facturas/src/app/dashboard-facturas/dashboard-facturas-routing.module.ts',
  },

  shared: sharedConfig,

  skip: [
    '@angular/material',
    '@angular/material-moment-adapter',
    '@angular/material/core',
    '@angular/material/datepicker',
    '@angular/material/form-field',
    '@angular/material/input',
    '@angular/material/icon',
    '@angular/cdk',
    '@angular/cdk/overlay',
    '@angular/cdk/portal',
    '@angular/cdk/a11y',
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket',
  ]
});
