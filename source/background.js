
function getBlogs() {
	return fetch('https://app.easyblognetworks.com/api/v1/blogs/', {
		method: 'GET',
		credentials: 'include'
	}).then(response => response.json())
}

function getLogin(blog_id) {
	return fetch(`https://app.easyblognetworks.com/api/v1/blogs/${blog_id}/`, {
		method: 'GET',
		credentials: 'include'
	}).then(response => response.json())
}

async function cache(fn, name, arg) {
	let cached = sessionStorage[name];
	if (!cached) {
		cached = await fn(arg);
		sessionStorage[name] = JSON.stringify(cached);
	} else {
		cached = JSON.parse(cached);
	}
	return cached;
}

async function parse(request, port) {
	if (!request.domain){
		port.postMessage({ error: "missing domain in request" });
		return
	}

	const blogs = await cache(getBlogs, 'blogs');

	for (const blog of blogs) {
		if (blog.domain == request.domain) {
			port.postMessage({ ok: "found login" });
			const login = await cache(getLogin, `blog-${blog.id}`, blog.id);
			port.postMessage({ user: login.wp_admin_username, pass: login.wp_admin_password});
			return
		}
	}
	port.postMessage({ warning: "no login found" });
}

chrome.runtime.onConnect.addListener(function (port) {
	port.onMessage.addListener(async function (msg) {
		await parse(msg, port);
	});
});
