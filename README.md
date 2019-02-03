# react-splitbox

> react splitter component (https://dioklecijan.github.io/react-splitbox/)

[![NPM](https://img.shields.io/npm/v/react-splitbox.svg)](https://www.npmjs.com/package/react-splitbox) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Requirements

This lib uses react hooks which means you need `react` and `react-dom` 
version `16.8.0-alpha1`or higher.

## Install

```bash
npm install --save react-splitbox
```

## Usage

```jsx
import React, { Component } from 'react'

import Splitter from 'react-splitbox'

class Example extends Component {

  onResize = childrenSizes => console.log(childrenSizes);

  render () {
    return (
      <Splitter vertical size="33%" onResize={this.onResize}>
        <div>top pane</div>
        <div>bottom pane</div>
      </Splitter>
    )
  }
}
```
Example app is in `example` directory.


## License

MIT © [dioklecijan](https://github.com/dioklecijan)
