import { h } from 'dom-chef';
import select from 'select-dom';
import domLoaded from 'dom-loaded';
import {safeElementReady} from './libs/utils';

async function init() {
	if (document.location.pathname != '/wp-login.php') {
		return;
	}
	await safeElementReady('body');
	await domLoaded;
	onDomReady();
}



function onDomReady() {
	const form = select('#loginform');
	if (!form) {
		return;
	}
	const port = chrome.runtime.connect({ name: document.location.hostname });
	const autoLogin = function(e) {
		const user = select("#user_login");
		const pass = select("#user_pass");
		e.target.setAttribute("disabled", "true");
		port.postMessage({ domain: document.location.hostname });
		port.onMessage.addListener(function (msg) {
			if (msg.user && msg.pass) {
				user.removeAttribute("name");
				pass.removeAttribute("name");
				form.append(
					<div>
						<input type="hidden" value={msg.user} name="log"/>
						<input type="hidden" value={msg.pass} name="pwd"/>
					</div>
				);
				select("#wp-submit").click();
			}
			else if (msg.ok) {
				user.setAttribute("disabled", "true");
				pass.setAttribute("disabled", "true");
			}else{
				e.target.removeAttribute("disabled");
				user.removeAttribute("disabled");
				pass.removeAttribute("disabled");
			}
		});
	}
	form.append(
		<p class="submit">
			<br />
			<label>
				<br />
				<button onClick={autoLogin} class="login-now button">Login with EBN Account</button>
			</label>
		</p>
	);
}

init();
