/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		// get country-code from params
		const countryLetters = url.searchParams.get('selectedCountry')
		console.log(countryLetters);
		  // Base HTML template (beautified version)
		  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Hello, World!</title>
  <style>
    body {
      background-color: #F58025; /* Cloudflare orange */
      background-image: url('https://cf-assets.www.cloudflare.com/dzlvafdwdttg/2rOGWxmNRWGNCHqs97Qcn8/11a5ddd97b85e640702330dc28ac7562/globe.png');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      background-attachment: fixed;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      position: relative;
    }

    body::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4); /* Dark overlay to make globe image faint */
      z-index: 1;
    }

    .container {
      background-color: rgba(255, 255, 255, 0.95); /* Slightly transparent white for contrast */
      padding: 2.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      max-width: 900px;
      margin: 2rem;
      text-align: center;
      position: relative;
      z-index: 2;
    }

    h1 {
      color: #F58025; /* Cloudflare orange for headings */
      font-size: 2.5rem;
      font-weight: 700;
      line-height: 1.3;
      margin-bottom: 1rem;
    }

    h2 {
      color: #F58025;
      font-size: 1.75rem;
      font-weight: 600;
      line-height: 1.4;
      margin: 1rem 0;
    }

    p {
      color: #1a1a1a; /* Dark gray for body text */
      font-size: 1.1rem;
      line-height: 1.7;
      white-space: pre-line;
    }

    label {
      color: #1a1a1a;
      font-size: 1.1rem;
      font-weight: 500;
      display: block;
      margin: 1rem 0 0.5rem;
    }

    select {
      padding: 0.75rem;
      font-size: 1rem;
      border: 1px solid #C6601E; /* Slightly darker orange border */
      border-radius: 6px;
      width: 200px;
      background-color: #fff;
      color: #1a1a1a;
      cursor: pointer;
      transition: border-color 0.2s;
    }

    select:focus {
      outline: none;
      border-color: #FF9F4A; /* Lighter orange accent */
    }

    table {
      background-color: #FFF3E0; /* Light orange table background */
      font-family: 'Inter', sans-serif;
      margin: 1.5rem auto;
      border-collapse: collapse;
      width: 80%;
      border-radius: 6px;
      overflow: hidden;
    }

    table td {
      padding: 0.75rem;
      font-size: 1rem;
      color: #1a1a1a;
      border: 1px solid #FFDAB9;
    }

    @media (max-width: 600px) {
      h1 {
        font-size: 2rem;
      }

      h2 {
        font-size: 1.5rem;
      }

      p {
        font-size: 1rem;
      }

      select {
        width: 100%;
      }

      table {
        width: 100%;
      }

      .container {
        margin: 1rem;
        padding: 1.5rem;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Good Day! Welcome to Immerse 2025 - AI Hub</h1>
    <h2>Let's see Cloudflare AI -- Translation in Action!</h2>

    <!-- Dropdown Selector -->
    <label for="country-select">Choose your country:</label>
    <select id="country-select" onchange="updateCountryQuery()">
      <option value="">-- Select --</option>
      <option value="US">United States</option>
      <option value="FR">France</option>
	  <option value="DE">Germany</option>
      <option value="CN">China</option>
	  <option value="JP">Japanese</option>
      <option value="MY">Malaysia</option>
      
	  
    </select>

    <script>
      function updateCountryQuery() {
        const selectedCountry = document.getElementById("country-select").value;
        if (selectedCountry) {
          const url = new URL(window.location);
          url.searchParams.set("selectedCountry", selectedCountry);
          window.location = url.toString(); // reload with updated query param
        }
      }
    </script>

	<h2>Translation for text</h2>	
    <p>{{TRANSLATED_TEXT}}</p>

	 <h2>Incoming Request details</h2>
    <table>
      <tr><td>Country</td><td>${request.cf.country}</td></tr>
      <tr><td>Longitude</td><td>${request.cf.longitude}</td></tr>
      <tr><td>Latitude</td><td>${request.cf.latitude}</td></tr>
      <tr><td>Autonomous System Organisation</td><td>${request.cf.asOrganization}</td></tr>
      <tr><td>Cloudflare Colo</td><td>${request.cf.colo}</td></tr>
      <tr><td>Timezone</td><td>${request.cf.timezone}</td></tr>
    </table>
  </div>
</body>
</html>`;
		  
			  // Default English text (fallback if KV lookup fails or lang is 'en')
			  const defaultText = `Cloudflare’s got the edge, it’s fast and it’s sly,
				Teaming up with AI, now it’s reaching the sky.
				It zaps every glitch with a digital wand,
				While AI writes haikus that servers grow fond.
				It firewalls bad bots with a smirk and a wink,
				And auto-scales faster than you can even think.
				It runs AI at the edge, no GPUs in sight,
				Just CPUs flexin’ with serverless might.`;	

			  let translatedText = defaultText;
		  
			  // Fetch translated text from KV if country-code is not 'SG'
			  if (countryLetters !== 'SG') {
				try {
				  translatedText = await env.translate_KV.get(countryLetters);
				  if (!translatedText) {
					console.warn(`No translation found for country: ${countryLetters}, falling back to English`);
					translatedText = defaultText;
				  }
				} catch (err) {
				  console.error(`Failed to fetch translation for lang: ${countryLetters}`, err);
				  translatedText = defaultText;
				}
			  }
		  
			  // Inject the translated text into the HTML
			  const modifiedHtml = htmlTemplate.replace('{{TRANSLATED_TEXT}}', translatedText);
		  
			  // Return the HTML response
			  return new Response(modifiedHtml, {
				headers: { 'Content-Type': 'text/html' },
			  });
			},
		  };
