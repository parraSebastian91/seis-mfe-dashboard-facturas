const { withNativeFederation } = require('@angular-architects/native-federation/config');
const { sharedConfig } = require('../../shared-federation.config');

module.exports = withNativeFederation({
  name: 'seis-mfe-dashboard-facturas',

  exposes: {
    './DashboardFacturasRoutingModule': 'projects/seis-mfe-dashboard-facturas/src/app/dashboard-facturas/dashboard-facturas-routing.module.ts',
  },

  shared: sharedConfig,

  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket',
  ]
});
