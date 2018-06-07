import {default as injectLogin} from './login';
import {default as injectLink} from './link';
import {default as injectUser} from './mix';

/* istanbul ignore next */
document.addEventListener('DOMContentLoaded', () => {
	injectLogin();
	injectLink();
	injectUser();
});
