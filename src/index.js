import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import memoryUtils from './utils/memoryUtils';
import storageUtils from './utils/storageUtils'

// 如果 local 中保存了 user, 将 user 保存到内存中 
const user = storageUtils.getUser()
console.log(user)
if (user && user.access_token) {
  memoryUtils.user = user
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

