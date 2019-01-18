
function afterMixpanelLoaded() {
	try {
		console.log('login ext people.set_once');
		mixpanel.people.set_once({
			extension: 'true'
		});
	} catch (error) {
		console.warn(error);
	}
}

function afterMixpanel() {
	if (window.mixpanel.__loaded) {
		console.log('login ext __loaded');
		afterMixpanelLoaded();
	} else {
		console.warn('login ext not __loaded');
		setTimeout(afterMixpanel, 100);
	}
}

function beforeMixpanel() {
	if (window.mixpanel) {
		console.log('login ext defined');
		afterMixpanel();
	} else {
		console.warn('login ext not defined');
		setTimeout(beforeMixpanel, 100);
	}
}

beforeMixpanel();
