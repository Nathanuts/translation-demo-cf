

export default {
	async fetch(req) {
		const url = new URL(req.url)
		url.pathname = "/__scheduled";
		url.searchParams.append("cron", "* * * * *");
		return new Response(`To test the scheduled handler, ensure you have used the "--test-scheduled" then try running "curl ${url.href}".`);
	},

	// The scheduled handler is invoked at the interval set in our wrangler.jsonc's
	// [[triggers]] configuration.
	async scheduled(event, env, ctx) {
		// A Cron Trigger can make requests to other endpoints on the Internet,
		// publish to a Queue, query a D1 Database, and much more.
		//
		// We'll keep it simple and make an API call to a Cloudflare API:
		
		let resp = await (await fetch('https://static.rlynat.com')).text();
		console.log('Raw HTML response:', resp);
		let blogText = '';
		
		const rewriter = new HTMLRewriter()
		  .on('body', {
			text(textChunk) {
			  blogText += textChunk.text;
			}
		  });

		await rewriter.transform(new Response(resp)).text();

		if (!blogText || blogText.trim() === '') {
			console.error('Error: blogText is empty or contains only whitespace');
			return;
		}
		console.log(blogText);
		// 2. Define the languages you want to translate to
		const targetLanguages = {
			US: 'en',
			FR: 'french',
			DE: 'german',
			CN: 'chinese',
			MY: 'malay',
			JP: 'japanese'
		  };
		
		  // 3. Translate into each language and store in KV
		  for (const [country_code, language] of Object.entries(targetLanguages)) {
			try {
			  const answer = await env.AI.run('@cf/meta/m2m100-1.2b', {
				text: blogText,
				source_lang: 'english',
				target_lang: language
			  });
			console.log(answer);
			  const translatedText = answer.translated_text || JSON.stringify(answer);
			await env.translate_KV.put(country_code ,translatedText)
			console.log(`Stored ${language} translation under key: ${country_code}`);
			} catch (err) {
				console.error(`Failed to translate to ${language}:`, err);
			  }
			}
		// You could store this result in KV, write to a D1 Database, or publish to a Queue.
		// In this template, we'll just log the result:
		}
	};
