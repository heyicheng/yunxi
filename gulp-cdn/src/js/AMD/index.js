'use strict';

require.config({
  baseUrl: "./",
  paths: {
    axios: '../../plugins/axios/axios'
  }
});
require(['axios'], function (axios) {
  console.log(axios);
});