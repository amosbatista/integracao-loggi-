"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var query = function query(params) {
  return "{\n    addressComponents: [\n      {longName: \"" + params.streetNumber + "\", shortName: \"" + params.streetNumber + "\", types: [\"street_number\"]}, \n      {longName: \"" + params.streetName + "\", shortName: \"" + params.streetName + "\", types: [\"route\"]}, \n      {longName: \"" + params.neighborhood + "\", shortName: \"" + params.neighborhood + "\", types: [\"neighborhood\", \"political\"]}, \n      {longName: \"" + params.city + "\", shortName: \"" + params.city + "\", types: [\"locality\", \"political\"]}, \n      {longName: \"" + params.state + "\", shortName: \"" + params.state + "\", types: [\"administrative_area_level_2\", \"political\"]},\n      {longName: \"" + params.state + "\", shortName: \"" + params.state + "\", types: [\"administrative_area_level_1\", \"political\"]}, \n      {longName: \"" + params.country + "\", shortName: \"" + params.countryShortName + "\", types: [\"country\", \"political\"]}, \n      {longName: \"" + params.postalCode + "\", shortName: \"" + params.postalCode + "\", types: [\"postal_code\"]}\n    ], \n    formattedAddress: \"" + params.streetName + ", " + params.streetNumber + " - " + params.neighborhood + ", " + params.city + " - " + params.state + ", " + params.postalCode + ", " + params.country + "\",\n    types: [\"street_address\"]\n  }";
};

exports.default = query;
//# sourceMappingURL=addressComponents.js.map