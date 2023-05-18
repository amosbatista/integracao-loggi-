import { TokenExpiredError } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

export default class {
  
  sign(objectToSign) {
    return jwt.sign(
      objectToSign, 
      process.env.THOT_TOKEN_SECRET, {
        expiresIn: process.env.THOT_TOKEN_EXPIRES_MINUTES * 60
      }
    )
  }
  
  signWithMinutes(objectToSign, minutesToExpire) {
    return jwt.sign(
      objectToSign, 
      process.env.THOT_TOKEN_SECRET, {
        expiresIn: minutesToExpire * 60
      }
    )
  }

  verify(token) {
    return new Promise( (resolve, reject) => {
  
      if (!token) {
        reject ("Não foi providenciado token de autenticação");
      }
      jwt.verify(
        token, 
        process.env.THOT_TOKEN_SECRET,
        (err, decoded) => {
          if (err) {
            console.log(err)
            
            if( err instanceof TokenExpiredError) {
              reject(`A autenticação expirou.`);
            }
            else {
              reject(`Erro ao decodificar token: ${err}`);
            }
          }
          else {
            resolve(decoded);
          }
        }
      );
    });
  }
}