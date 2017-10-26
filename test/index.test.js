/* eslint-env jest */
/* global test */
/* @flow */

import React from 'react'
import ReactDOM from 'react-dom'
import ReactTestUtils from 'react-dom/test-utils'

import HelloWorld from '../src/components/HelloWorld'

test('index test', () => {
  const helloWorld = ReactTestUtils.renderIntoDocument(<HelloWorld />)

  const helloWorldNode = ReactDOM.findDOMNode(helloWorld)

  // Verify that it's Off by default
  expect(helloWorldNode.textContent).toEqual('Hello, world!!!')
})
