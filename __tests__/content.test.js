/* eslint camelcase: ["error", {properties: "never"}] */

import {default as injectLogin} from '../source/content';

describe('content script', () => {
	afterEach(() => {
		fixture.cleanup();
	});

	it('should not inject itself on non wp-login pages', async () => {
		await injectLogin();
	});

	it('should inject itself on wp-login pages', async () => {
		fixture.load('__tests__/fixtures/login.html');
		jsdom.reconfigure({url: 'https://domain.tld/wp-login.php'});
		expect(window.location.pathname).toEqual('/wp-login.php');

		await injectLogin();

		const button = document.querySelector('button.login-now').textContent;
		expect(button).toEqual('Login with EBN Account');
	});

	it('should have click handler', async () => {
		fixture.load('__tests__/fixtures/login.html');
		jsdom.reconfigure({url: 'https://domain.tld/wp-login.php'});
		expect(window.location.pathname).toEqual('/wp-login.php');

		await injectLogin();

		const button = document.querySelector('button.login-now');
		expect(button.textContent).toEqual('Login with EBN Account');
		button.click();
		expect(portMock.postMessage).toBeCalledWith({domain: 'domain.tld'});
		const handler = portMock.onMessage.addListener.mock.calls[0][0];
		expect(handler).toBeDefined();
	});

	it('should update form when domain is found', async () => {
		fixture.load('__tests__/fixtures/login.html');
		jsdom.reconfigure({url: 'https://domain.tld/wp-login.php'});
		expect(window.location.pathname).toEqual('/wp-login.php');

		await injectLogin();

		const button = document.querySelector('button.login-now');
		expect(button.textContent).toEqual('Login with EBN Account');
		button.click();

		expect(portMock.postMessage).toBeCalledWith({domain: 'domain.tld'});
		const handler = portMock.onMessage.addListener.mock.calls[0][0];

		const submit = jest.fn();
		HTMLFormElement.prototype.submit = submit;
		handler({user: 'user', pass: 'pass'});
		expect(submit).toBeCalledWith();
	});

	it('should not update form if domain is not found', async () => {
		fixture.load('__tests__/fixtures/login.html');
		jsdom.reconfigure({url: 'https://domain.tld/wp-login.php'});
		expect(window.location.pathname).toEqual('/wp-login.php');

		await injectLogin();

		const button = document.querySelector('button.login-now');
		expect(button.textContent).toEqual('Login with EBN Account');
		button.click();

		expect(portMock.postMessage).toBeCalledWith({domain: 'domain.tld'});
		const handler = portMock.onMessage.addListener.mock.calls[0][0];

		const submit = jest.fn();
		HTMLFormElement.prototype.submit = submit;
		handler({error: 'Something is wrong!'});
		expect(submit.mock.calls.length).toEqual(0);
	});
});
