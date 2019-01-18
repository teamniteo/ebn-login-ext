/* eslint camelcase: ["error", {properties: "never"}] */

import {
	default as injectLogin
} from '../source/login';

describe('content script', () => {
	afterEach(() => {
		fixture.cleanup();
		jest.restoreAllMocks();
		portMock.onMessage.addListener = jest.fn();
	});

	it('should not inject itself on non wp-login pages', async () => {
		await injectLogin();
	});

	it('should inject itself on wp-login pages', async () => {
		fixture.load('__tests__/fixtures/login.html');
		jsdom.reconfigure({
			url: 'https://domain.tld/wp-login.php'
		});
		expect(window.location.pathname).toEqual('/wp-login.php');

		await injectLogin();
		let blogsHandler = portMock.onMessage.addListener.mock.calls[0][0];
		blogsHandler({
			blogs: [{
				domain: "domain.tld"
			}]
		})

		portMock.onMessage.addListener()
		const button = document.querySelector('button.login-now').textContent;
		expect(button).toEqual('EBN Blog Login');
	});

	it('should have click handler', async () => {
		fixture.load('__tests__/fixtures/login.html');
		jsdom.reconfigure({
			url: 'https://domain.tld/wp-login.php'
		});
		expect(window.location.pathname).toEqual('/wp-login.php');

		await injectLogin();
		let blogsHandler = portMock.onMessage.addListener.mock.calls[0][0];
		blogsHandler({
			blogs: [{
				domain: "domain.tld"
			}]
		})

		const button = document.querySelector('button.login-now');
		expect(button.textContent).toEqual('EBN Blog Login');
		button.click();
		expect(portMock.postMessage).toBeCalledWith({
			domain: 'domain.tld'
		});

	});

	it('should update form when domain is found', async () => {
		fixture.load('__tests__/fixtures/login.html');
		jsdom.reconfigure({
			url: 'https://domain.tld/wp-login.php'
		});
		expect(window.location.pathname).toEqual('/wp-login.php');

		await injectLogin();
		let blogsHandler = portMock.onMessage.addListener.mock.calls[0][0];
		blogsHandler({
			blogs: [{
				domain: "domain.tld"
			}]
		})

		const button = document.querySelector('button.login-now');
		expect(button.textContent).toEqual('EBN Blog Login');
		button.click();

		expect(portMock.postMessage).toBeCalledWith({
			domain: 'domain.tld'
		});

		const submit = jest.fn();
		HTMLFormElement.prototype.submit = submit;

		let loginHandler = portMock.onMessage.addListener.mock.calls[1][0];
		loginHandler({
			user: "user",
			pass: "pass"
		})
		expect(submit).toBeCalledWith();
	});

	it('should not update form if domain is not found', async () => {
		fixture.load('__tests__/fixtures/login.html');
		jsdom.reconfigure({
			url: 'https://domain.tld/wp-login.php'
		});
		expect(window.location.pathname).toEqual('/wp-login.php');

		await injectLogin();
		let blogsHandler = portMock.onMessage.addListener.mock.calls[0][0];
		blogsHandler({
			blogs: [{
				domain: "domain.tld"
			}]
		})

		const button = document.querySelector('button.login-now');
		expect(button.textContent).toEqual('EBN Blog Login');
		button.click();

		expect(portMock.postMessage).toBeCalledWith({
			domain: 'domain.tld'
		});
		const loginHandler = portMock.onMessage.addListener.mock.calls[0][0];

		const submit = jest.fn();
		HTMLFormElement.prototype.submit = submit;
		loginHandler({
			error: 'Something is wrong!'
		});
		expect(submit.mock.calls.length).toEqual(0);
	});
});
