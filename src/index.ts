import { application } from './server'

const port = process.env.PORT || 3000

const logStartUp = (err: Error) => {
  if (err) {
    // tslint:disable-next-line:no-console
    console.log(err)
  }
  // tslint:disable-next-line:no-console
  console.log(`server is listening on ${port}`)
}

application.listen(port, logStartUp)