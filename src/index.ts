import express, { Request, Response, NextFunction } from 'express'

import bodyParser from 'body-parser'
import Japer, { MemoryStore } from 'japer'

// this will always be called before the Japer router
const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  // if (!req.isAuthenticated || !(req.isAuthenticated instanceof Function && req.isAuthenticated())) { // set by Passport
  //   res.sendStatus(401)    
  // }
  next()
}

const handler = (req: Request)  => {
  const { docName, id, urlVersion } = req.params
  const bodyVersion = req.body?.version
  console.log(`[${req.method}] docName: ${docName}, id: ${id}, urlVersion: ${urlVersion} bodyVersion: ${bodyVersion}`)

  if(req.envelopes) {
    console.log('envelopes', JSON.stringify(req.envelopes, null, 2))
  } else {
    throw new Error('handler did not receive any envelopes')
  }
  
  if(req.method === 'POST') {
    req.envelopes[0].extra = {...req.envelopes[0].extra, ...{[(new Date()).getTime().toString()]: 'from handler'}}
  }

  return { status: 200}
}

(async () => {
  let app: express.Express
  app = express()

  const store = new MemoryStore('test')
  const japer = new Japer({ store: store })
  japer.use(handler)

  // TODO bodyParser needs to be dev dependency
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))

  app.use('/japer', ensureAuthenticated, japer.router)

  app.get('/', (req, res) => {
    res.status(200).send({message: 'hello world\n'})
  })

  await app.listen(3000)

  console.log('listening on 3000')
  })()

