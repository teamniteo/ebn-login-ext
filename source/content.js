import {default as injectLogin} from './login';
import {default as injectLink} from './link';

/* istanbul ignore next */
document.addEventListener('DOMContentLoaded', () => {
	injectLogin();
	injectLink();
});
