export default (message, data) =>{
  
  if(!data){
    console.log(message); return
  }

  const messagePlusData = `${message}: `

  if(typeof data == "object"){
    console.log(messagePlusData, JSON.stringify(data)); return
  }
  console.log(messagePlusData, data)
}