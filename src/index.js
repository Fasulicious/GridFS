import '@babel/polyfill'

import app from './server'

(async function(){
  try{
    const port = app.get('port')
    await app.listen(port)
    console.log(`Server listening on port ${port}`)
  }catch(err){
    console.log(err)
  }
})()