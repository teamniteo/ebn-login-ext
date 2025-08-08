/* eslint camelcase: ["error", {allow: ["extension_linked"]}] */

import {h} from 'dom-chef';
import select from 'select-dom';
import OptionsSync from 'webext-options-sync';

export default async function injectLink() {
	if (document.location.href !== 'https://app.easyblognetworks.com/settings-account/') {
		return;
	}

	const link = select('div#item-deformField5');
	const autoLink = function (e) {
		const email = select('input[name=email]').getAttribute('value');
		const apikey = select('p#deformField5').textContent.trim();
		new OptionsSync().setAll({
			email,
			apikey
		});
		link.append(
			<p><br />Your EBN account is now linked with the extension.</p>
		);
		e.preventDefault();
		return false;
	};

	select('div#item-deformField5').append(
		<button type="button" onClick={autoLink} class="link-now btn btn-success">
			Link with EBN Blog Login extension
		</button>
	);
}
