// refer: https://datatracker.ietf.org/doc/html/draft-pantos-http-live-streaming-08
function EXTM3U(opts) {
	return new (class {
		constructor(opts) {
			this.name = "EXTM3U v0.8.1";
			this.opts = opts;
			this.newLine = (this.opts.includes("\n")) ? "\n" : (this.opts.includes("\r")) ? "\r" : (this.opts.includes("\r\n")) ? "\r\n" : "\n";
		};

		parse(m3u8 = new String) {
			console.log(`☑️ ${this.name}, parse EXTM3U`, "");
			/***************** v0.7.0-beta *****************/
			const EXTM3U_Regex = /^(?<TYPE>(?:EXT|AIV)[^#:]+):?(?<OPTION>.+)?[\r\n]?(?<URI>.+)?$/;
			let json = m3u8.replace(/\r\n/g, "\n").split(/[\r\n]+#/).map(v => v.match(EXTM3U_Regex)?.groups ?? v).map(item => {
				if (/=/.test(item?.OPTION)) item.OPTION = Object.fromEntries(`${item.OPTION}\,`.split(/,\s*(?![^"]*",)/).slice(0, -1).map(option => {
					option = option.split(/=(.*)/);
					option[1] = (isNaN(option[1])) ? option[1].replace(/^"(.*)"$/, "$1") : parseInt(option[1], 10);
					return option;
				}));
				return item
			});
			console.log(`✅ ${this.name}, parse WebVTT`, `json: ${JSON.stringify(json)}`, "");
			return json
		};

		stringify(json = new Array) {
			console.log(`☑️ ${this.name}, stringify EXTM3U`, "");
			if (!json?.[0]?.includes("#EXTM3U")) json.unshift("#EXTM3U")
			const OPTION_value_Regex = /^((-?\d+[x.\d]+)|[0-9A-Z-]+)$/;
			let m3u8 = json.map(item => {
				if (typeof item?.OPTION == "object") item.OPTION = Object.entries(item.OPTION).map(option => {
					if (item.TYPE === "EXT-X-SESSION-DATA") option[1] = `"${option[1]}"`;
					else if (!isNaN(option[1])) option[1] = (typeof option[1] === "number") ? option[1] : `"${option[1]}"`;
					else if (option[0] === "INSTREAM-ID") option[1] = `"${option[1]}"`;
					else if (!OPTION_value_Regex.test(option[1])) option[1] = `"${option[1]}"`;
					return option.join("=");
				}).join(",");
				/***************** v0.7.0-beta *****************/
				return item = (item.URI) ? item.TYPE + ":" + item.OPTION + this.newLine + item.URI
					: (item.OPTION) ? item.TYPE + ":" + item.OPTION
						: (item.TYPE) ? item.TYPE
							: item
			}).join(this.newLine + "#");
			console.log(`✅ ${this.name}, stringify EXTM3U`, `m3u8: ${m3u8}`, "");
			return m3u8
		};
	})(opts)
};
