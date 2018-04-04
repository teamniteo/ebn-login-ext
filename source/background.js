function getBlogs() {
	return fetch('https://app.easyblognetworks.com/api/v1/blogs/', {
		method: 'GET',
		credentials: 'include'
	}).then(response => response.json());
}

function getLogin(blogId) {
	return fetch(`https://app.easyblognetworks.com/api/v1/blogs/${blogId}/`, {
		method: 'GET',
		credentials: 'include'
	}).then(response => response.json());
}

export default async function handleRequest(request, port) {
	if (!request.domain) {
		port.postMessage({error: 'Missing domain in request.'});
		return;
	}

	let blog;
	const blogs = await getBlogs();

	for (const rBlog of blogs) {
		if (rBlog.domain === request.domain) {
			blog = rBlog;
			break;
		}
	}

	if (blog) {
		const login = await getLogin(blog.id);
		port.postMessage({user: login.wp_admin_username, pass: login.wp_admin_password});
	} else {
		port.postMessage({error: 'Not managed by EBN.'});
	}
}

chrome.runtime.onConnect.addListener(port => { /* istanbul ignore next line */
	port.onMessage.addListener(async msg => { /* istanbul ignore next line */
		await handleRequest(msg, port);
	});
});
