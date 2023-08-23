// refer: https://datatracker.ietf.org/doc/html/draft-pantos-http-live-streaming-08
function EXTM3U(opts) {
	return new (class {
		constructor(opts) {
			this.name = "EXTM3U v0.8.5";
			this.opts = opts;
			this.newLine = (this.opts.includes("\n")) ? "\n" : (this.opts.includes("\r")) ? "\r" : (this.opts.includes("\r\n")) ? "\r\n" : "\n";
		};

		parse(m3u8 = new String) {
			const EXTM3U_Regex = /^(?:(?<TAG>#(?:EXT|AIV)[^#:\s\r\n]+)(?::(?<OPTION>[^\r\n]+))?(?:(?:\r\n|\r|\n)(?<URI>[^#\s\r\n]+))?|(?<NOTE>#[^\r\n]+)?)(?:\r\n|\r|\n)?$/gm;
			let json = [...m3u8.matchAll(EXTM3U_Regex)].map(item => {
				item = item?.groups || item;
				if (/=/.test(item?.OPTION)) item.OPTION = Object.fromEntries(`${item.OPTION}\,`.split(/,\s*(?![^"]*",)/).slice(0, -1).map(option => {
					option = option.split(/=(.*)/);
					option[1] = (isNaN(option[1])) ? option[1].replace(/^"(.*)"$/, "$1") : parseInt(option[1], 10);
					return option;
				}));
				return item
			});
			return json
		};

		stringify(json = new Array) {
			if (json?.[0]?.TAG !== "#EXTM3U") json.unshift({ "TAG": "#EXTM3U" })
			const OPTION_value_Regex = /^((-?\d+[x.\d]+)|[0-9A-Z-]+)$/;
			let m3u8 = json.map(item => {
				if (typeof item?.OPTION === "object") item.OPTION = Object.entries(item.OPTION).map(option => {
					if (item?.TAG === "#EXT-X-SESSION-DATA") option[1] = `"${option[1]}"`;
					else if (!isNaN(option[1])) option[1] = (typeof option[1] === "number") ? option[1] : `"${option[1]}"`;
					else if (option[0] === "INSTREAM-ID" || option[0] === "KEYFORMAT") option[1] = `"${option[1]}"`;
					else if (!OPTION_value_Regex.test(option[1])) option[1] = `"${option[1]}"`;
					return option.join("=");
				}).join(",");
				return item = (item?.URI) ? item.TAG + ":" + item.OPTION + this.newLine + item.URI
					: (item?.OPTION) ? item.TAG + ":" + item.OPTION
						: (item?.TAG) ? item.TAG
							: (item?.NOTE) ? item.NOTE
								: "";
			}).join(this.newLine);
			return m3u8
		};
	})(opts)
};
