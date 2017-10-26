/* @flow */
import React from 'react'
import ReactDOM from 'react-dom'

import HelloWorld from './components/HelloWorld'

ReactDOM.render(<HelloWorld />, document.getElementById('app'))

if (module.hot) module.hot.accept()
