import OptionsSync from 'webext-options-sync';

async function getAuth() {
	const options = await new OptionsSync().getAll();
	const key = btoa(`${options.email}:${options.apikey}`);
	console.log(key);
	return new Headers({
		Authorization: `Basic ${key}`
	});
}

async function getBlogs() {
	return fetch(
		'https://app.easyblognetworks.com/api/v1/blogs/?fields=domain,id',
		{
			method: 'GET',
			headers: await getAuth(),
			referrer: 'no-referrer'
		}
	).then(response => response.json());
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
		port.postMessage({
			user: login.wp_admin_username,
			pass: login.wp_admin_password
		});
	} else {
		port.postMessage({error: 'Not managed by EBN.'});
	}
}
