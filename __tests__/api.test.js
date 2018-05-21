/* eslint camelcase: ["error", {properties: "never"}] */

import {default as handleRequest} from '../source/api';

function port(mockery) {
	return {
		postMessage: e => {
			mockery(e);
		}
	};
}

describe('background app', () => {
	afterEach(() => {
		fetch.resetMocks();
	});

	it('should ignore invalid use', async () => {
		const mock = jest.fn();
		await handleRequest({}, port(mock));
		expect(mock).toBeCalledWith({error: 'Missing domain in request.'});
	});

	it('should return error if domain is not found', async () => {
		fetch.mockResponse(JSON.stringify([{id: 1, domain: 'random.org'}]));
		const mock = jest.fn();
		await handleRequest({domain: 'test.si'}, port(mock));
		expect(mock).toBeCalledWith({error: 'Not managed by EBN.'});
	});

	it('should return pass and user if domain is found', async () => {
		const data = {wp_admin_username: 'user', wp_admin_password: 'pass'};
		fetch
			.once(JSON.stringify([{id: 1, domain: 'random.org'}]))
			.once(JSON.stringify(data));
		const mock = jest.fn();
		await handleRequest({domain: 'random.org'}, port(mock));
		expect(mock).toBeCalledWith({pass: 'pass', user: 'user'});
	});
});
