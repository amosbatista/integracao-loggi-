const query = (params) => {
  return `{
    addressComponents: [
      {longName: "${params.streetNumber}", shortName: "${params.streetNumber}", types: ["street_number"]}, 
      {longName: "${params.streetName}", shortName: "${params.streetName}", types: ["route"]}, 
      {longName: "${params.neighborhood}", shortName: "${params.neighborhood}", types: ["neighborhood", "political"]}, 
      {longName: "${params.city}", shortName: "${params.city}", types: ["locality", "political"]}, 
      {longName: "${params.state}", shortName: "${params.state}", types: ["administrative_area_level_2", "political"]},
      {longName: "${params.state}", shortName: "${params.state}", types: ["administrative_area_level_1", "political"]}, 
      {longName: "${params.country}", shortName: "${params.countryShortName}", types: ["country", "political"]}, 
      {longName: "${params.postalCode}", shortName: "${params.postalCode}", types: ["postal_code"]}
    ], 
    formattedAddress: "${params.streetName}, ${params.streetNumber} - ${params.neighborhood}, ${params.city} - ${params.state}, ${params.postalCode}, ${params.country}",
    types: ["street_address"]
  }`
}

export default query