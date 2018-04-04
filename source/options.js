import OptionsSync from 'webext-options-sync';

export default async function setup() {
	new OptionsSync().syncForm('#options-form');
}

document.addEventListener('DOMContentLoaded', () => {
	/* istanbul ignore next line */
	setup();
});
