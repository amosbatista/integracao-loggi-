import { Router } from 'express'

import TokenService from '../../auth/cripto/JWTTokenService';
import SaveCardMapper from '../../cardControl/mapper/new';
import UpdateCardMapper from '../../cardControl/mapper/update';
import HaveUserOne from '../../cardControl/mapper/haveUserOne';
import CieloCardTokenService from '../../bankTransaction/cieloCardTokenService';
//import CieloCardTokenService from '../../bankTransactionMock/cieloCardTokenService';

export default ({ config, db }) => {

	let api = Router();

	api.post('/', async (req, res) => {
    
    const STATUS_SERVER_ERROR = 500;
    const STATUS_UNAUTHORIZED = 401;
    

    const token = req.header("Authorization");
    const tokenService = new TokenService();
    const userFromToken = await tokenService.verify(token).catch((err) => {
      const message = 'Erro de autenticação'
      console.log(message, err)
      res.status(STATUS_UNAUTHORIZED).json(err)
      res.end()

      throw new Error(message)
    });
    
    const cardData =  {
      "cardNumber": req.body.cardNumber.replace(/\./g, ""),
      "nameFromCard": req.body.nameFromCard,
      "validate": req.body.validate, 
      "brand": req.body.brand
    }
    const cardToken = await CieloCardTokenService(cardData).catch((err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()

      throw new Error(err.message)
    });
    
    const haveUserOne = new HaveUserOne();
    const userCard = await haveUserOne.load(userFromToken.id).catch((err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()

      throw new Error(err.message)
    });
    
    const NUMBERS_EXIBIT_CARD = 4;
    const cardFormattedNumber = cardData.cardNumber.substr(cardData.cardNumber.length - NUMBERS_EXIBIT_CARD, NUMBERS_EXIBIT_CARD);
    
    if(userCard) {
      const updateCardMapper = new UpdateCardMapper();
      await updateCardMapper.update(
        userFromToken.id,
        cardToken,
        cardFormattedNumber,
        cardData.brand,
      ).catch((err) => {
        console.log(err.message, err.data)
        res.status(STATUS_SERVER_ERROR).json(err.message)
        res.end()

        throw new Error(err.message)
      });  
    }
    else{
      const saveCardMapper = new SaveCardMapper();
      await saveCardMapper.save(
        userFromToken.id,
        cardToken,
        cardFormattedNumber,
        cardData.brand,
      ).catch((err) => {
        console.log(err.message, err.data)
        res.status(STATUS_SERVER_ERROR).json(err.message)
        res.end()

        throw new Error(err.message)
      });  
    }
    
    res.json({
      cardNumber: cardFormattedNumber
    })
    res.end()
    
  })
  
  return api;
}