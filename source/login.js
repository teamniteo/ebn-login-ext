import {h} from 'dom-chef';
import select from 'select-dom';

export default async function injectLogin() {
	if (document.location.pathname !== '/wp-login.php') {
		return;
	}

	const form = select('#loginform');
	const port = chrome.runtime.connect({name: document.location.hostname});
	const autoLogin = function (e) {
		e.preventDefault();
		const user = select('#user_login');
		const pass = select('#user_pass');
		const submit = select('#wp-submit');
		e.target.setAttribute('disabled', 'true');
		port.postMessage({domain: document.location.hostname});
		port.onMessage.addListener(msg => {
			if (msg.user && msg.pass) {
				user.value = msg.user;
				pass.value = msg.pass;
				form.submit();
				submit.setAttribute('disabled', 'true');
				user.setAttribute('disabled', 'true');
				pass.setAttribute('disabled', 'true');
			}
		});
		return false;
	};

	port.onMessage.addListener(msg => {
		if (msg.blogs) {
			const host = document.location.hostname.replace('www.', '');
			for (const blog of msg.blogs) {
				if (host.indexOf(blog.domain) > -1) {
					form.append(
						<p class="submit">
							<br />
							<label>
								<br />
								<button onClick={autoLogin} class="login-now button">
									EBN Blog Login
								</button>
							</label>
						</p>
					);
				}
			}
		}
	});
	port.postMessage({list: true});
}
