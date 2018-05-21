/* eslint camelcase: ["error", {properties: "never"}] */

import {default as injectLink} from '../source/link';

describe('content script', () => {
	afterEach(() => {
		fixture.cleanup();
	});

	it('should not inject itself on non account pages', async () => {
		await injectLink();
	});

	it('should inject itself on account pages', async () => {
		fixture.load('__tests__/fixtures/link.html');
		jsdom.reconfigure({
			url: 'https://app.easyblognetworks.com/settings/'
		});
		expect(window.location.pathname).toEqual('/settings/');

		await injectLink();

		const button = document.querySelector('button.link-now').textContent;
		expect(button).toEqual('Link with EBN Login extension');
	});

	it('should have click handler', async () => {
		fixture.load('__tests__/fixtures/link.html');
		jsdom.reconfigure({
			url: 'https://app.easyblognetworks.com/settings/'
		});
		expect(window.location.pathname).toEqual('/settings/');

		await injectLink();

		const button = document.querySelector('button.link-now').textContent;
		expect(button).toEqual('Link with EBN Login extension');
	});
});
