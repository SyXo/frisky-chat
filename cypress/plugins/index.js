// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const { client: WebSocketClient } = require('websocket')
const _ = require('lodash')

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('file:preprocessor', file => {
    console.log('AAAAAAAA', file)
    const client = new WebSocketClient()
    // 'echo-protocol',
    // 'http://livereload.com/protocols/official-7',
    console.log('YIKES', client)

    const refresh = _.debounce(() => {
      file.emit('rerun')
    })

    client.on('connectFailed', error => {
      console.log('Connect Error: ' + error.toString())
    })

    client.on('connect', connection => {
      connection.on('error', error =>
        console.error('websocket error:', error.toString()),
      )

      connection.on('message', message => {
        console.log('message!', message)
        const res = JSON.parse(message.utf8Data)

        if (res.command === 'hello') {
          connection.sendUTF(
            JSON.stringify({
              command: 'info',
              plugins: { less: { disable: false, version: '1.0' } },
              url: 'http://localhost:8080/',
            }),
          )
        }
        if (res.command === 'reload') {
          refresh()
        }
      })

      connection.sendUTF(
        JSON.stringify({
          command: 'hello',
          protocols: [
            'http://livereload.com/protocols/official-7',
            'http://livereload.com/protocols/official-8',
            'http://livereload.com/protocols/2.x-origin-version-negotiation',
          ],
        }),
      )
    })

    client.connect('ws://localhost:35729/livereload')

    // client.onopen = () => {
    //   console.log('ready!')
    // }

    // client.onerror = err => {
    //   console.log('oops', err)
    // }

    // client.onmessage = evt => {
    //   console.log('OOOOOO', evt)
    // }
    return file.filePath
  })
}
