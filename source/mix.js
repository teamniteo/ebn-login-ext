
export default async function injectUser() {
	if (document.location.host === 'app.easyblognetworks.com') {
		const s = document.createElement('script');
		s.src = chrome.extension.getURL('track.js');
		(document.head || document.documentElement).append(s);
	}
}
