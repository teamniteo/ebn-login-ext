import {h} from 'dom-chef';
import select from 'select-dom';

export default async function injectLogin() {
	if (document.location.pathname !== '/wp-login.php') {
		return;
	}

	const form = select('#loginform');
	const port = chrome.runtime.connect({name: document.location.hostname});
	const autoLogin = function (e) {
		const user = select('#user_login');
		const pass = select('#user_pass');
		e.target.setAttribute('disabled', 'true');
		port.postMessage({domain: document.location.hostname});
		port.onMessage.addListener(msg => {
			if (msg.user && msg.pass) {
				user.setAttribute('disabled', 'true');
				pass.setAttribute('disabled', 'true');
				user.value = msg.user;
				pass.value = msg.pass;
				form.submit();
			} else {
				e.target.removeAttribute('disabled');
			}
		});
	};
	form.append(
		<p class="submit">
			<br />
			<label>
				<br />
				<button onClick={autoLogin} class="login-now button">
					Login with EBN Account
				</button>
			</label>
		</p>
	);
}
