import { sha256 } from 'js-sha256';

export default (content, salt) => {
  
  
  return sha256(`${content}${salt}`);
}