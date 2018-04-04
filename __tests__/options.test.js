/* eslint camelcase: ["error", {properties: "never"}] */

import {default as setup} from '../source/options';

describe('options view', () => {
	afterEach(() => {
		fixture.cleanup();
	});

	it('should sync on options page', async () => {
		fixture.load('source/options.html');
		await setup();
	});
});
