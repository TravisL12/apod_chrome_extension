import React from 'react';
import { render } from 'react-dom';

import ApodBody from './ApodBody';
import './index.css';

render(<ApodBody />, window.document.querySelector('#app-container'));

if (module.hot) module.hot.accept();
