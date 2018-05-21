import OptionsSync from 'webext-options-sync';

async function getAuth() {
	const options = await new OptionsSync().getAll();
	const key = btoa(`${options.email}:${options.apikey}`);
	return new Headers({
		Authorization: `Basic ${key}`
	});
}

async function getBlogs(page = 1, blogs = []) {
	const login = await getAuth();
	const url = `https://app.easyblognetworks.com/api/v1/blogs/?fields=domain,id&page_size=200&page=${page}`;
	return new Promise((resolve, reject) => fetch(
		url,
		{
			method: 'GET',
			headers: login,
			referrer: 'no-referrer'
		}
	).then(response => {
		if (response.status !== 200) {
			throw response;
		}
		response.json().then(data => {
			blogs = blogs.concat(data.blogs);

			if (data.pages_count > data.page) {
				getBlogs(data.page + 1, blogs).then(resolve).catch(reject);
			} else {
				resolve(blogs);
			}
		}).catch(reject);
	}).catch(reject));
}

async function getLogin(blogId) {
	return fetch(
		`https://app.easyblognetworks.com/api/v1/blogs/${blogId}/?fields=wp_admin_username,wp_admin_password`,
		{
			method: 'GET',
			headers: await getAuth(),
			referrer: 'no-referrer'
		}
	).then(response => response.json());
}

async function getLoginAuto(blogId) {
	return fetch(
		`https://app.easyblognetworks.com/api/v1/blogs/${blogId}/`,
		{
			method: 'GET',
			headers: await getAuth(),
			referrer: 'no-referrer'
		}
	).then(response => response.json());
}

export default async function handleRequest(request, port) {
	if (request.loginInline) {
		const login = await getLoginAuto(request.loginInline);
		console.log(login);
		chrome.tabs.create({url: login.wp_auto_login});
		return;
	}
	if (request.list) {
		let blogs = [];
		if (sessionStorage.blogs) {
			blogs = JSON.parse(sessionStorage.blogs);
		} else {
			blogs = await getBlogs();
			sessionStorage.blogs = JSON.stringify(blogs);
		}
		port.postMessage({blogs});
		return;
	}

	if (!request.domain) {
		port.postMessage({error: 'Missing domain in request.'});
		return;
	}

	// Handle www. prefix
	if (request.domain.indexOf('www.') === 0) {
		request.domain = request.domain.replace('www.', '');
	}

	let blog;
	let blogs = [];
	if (sessionStorage.blogs) {
		blogs = JSON.parse(sessionStorage.blogs);
	} else {
		blogs = await getBlogs();
		sessionStorage.blogs = JSON.stringify(blogs);
	}

	for (const rBlog of blogs) {
		if (rBlog.domain === request.domain) {
			blog = rBlog;
			break;
		}
	}

	if (blog) {
		const login = await getLogin(blog.id);
		port.postMessage({
			user: login.wp_admin_username,
			pass: login.wp_admin_password
		});
	} else {
		port.postMessage({error: 'Not managed by EBN.'});
	}
}
