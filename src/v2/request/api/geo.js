import service from '../../geolocalization/googleSearchAddressService'
import { Router } from 'express'
import logService from '../log/logGenerator'

const api = () => {

	let api = Router(); 

	api.post('/', async (req, res) => {

    const addressError = validate(req.body.addressData)

    if(addressError){
      errorDealer({
        message: addressError,
        data: null
      }, res)

      return
    }
    const completeAddress = `${req.body.addressData.streetName}, ${req.body.addressData.streetNumber}, ${req.body.addressData.city} - ${req.body.addressData.state} - ${req.body.addressData.country} - ${req.body.addressData.postalCode}`
    
    logService('Geo request', completeAddress)

    const geolocalization = await service(completeAddress)
      .catch((err)=>{
        errorDealer(err, res)
      })

    res.json(geolocalization)
    res.end()

    return
    
	});

	return api;
}

const STATUS_SERVER_ERROR = 500

const errorDealer = (err, res) => {
  console.log(err.message, err.data)
  res.status(STATUS_SERVER_ERROR).json(err.message)
  res.end()
}

const validate = (data) =>{
  if(!data) return "Informe alguma coisa para geolocalização."
  if(!data.streetName) return "Endereço não informado."
  if(!data.streetNumber) return "Número não informado."
  if(!data.postalCode) return "CEP não informado."
  if(!data.city) return "Cidade não informada."
  if(!data.state) return "Estado não informado."
  if(!data.country) return "País não informado."

  return null
}

export default api