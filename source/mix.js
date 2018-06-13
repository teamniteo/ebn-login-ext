import {h} from 'dom-chef';
import select from 'select-dom';
import OptionsSync from 'webext-options-sync';

export default async function injectUser() {
	if (document.location.host == 'app.easyblognetworks.com') {
		var s = document.createElement('script');
		s.src = chrome.extension.getURL('track.js');
		(document.head || document.documentElement).appendChild(s);
	}
}
