import {h} from 'dom-chef';
import select from 'select-dom';
import OptionsSync from 'webext-options-sync';

export default async function injectUser() {
	if (document.location.href !== 'https://app.easyblognetworks.com') {
		return;
	}
	try {
		mixpanel.people.set_once({
			'extension': 'true'
		});
	} catch (err) {console.warn(err);}

}
