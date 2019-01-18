/* eslint camelcase: ["error", {properties: "never"}] */

import {
	default as handleRequest
} from '../source/api';

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
		expect(mock).toBeCalledWith({
			error: 'Missing domain in request.'
		});
	});

	it('should return list of blogs', async () => {

		sessionStorage.blogs = "[]";

		const mock = jest.fn();
		await handleRequest({
			list: true
		}, port(mock));
		expect(mock).toBeCalledWith({"blogs": []});
	});

	it('should return error if domain is not found', async () => {

		fetch.mockResponse(JSON.stringify([{
			id: 1,
			domain: 'random.org'
		}]));
		sessionStorage.blogs = "[]";

		const mock = jest.fn();
		await handleRequest({
			domain: 'test.si'
		}, port(mock));
		expect(mock).toBeCalledWith({
			error: 'Not managed by EBN.'
		});
	});
});
