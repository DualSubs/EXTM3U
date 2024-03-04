// refer: https://datatracker.ietf.org/doc/html/draft-pantos-http-live-streaming-08
export default class EXTM3U {
	static name = "EXTM3U";
	static version = "0.8.7";
	static about = () => console.log(`\n🟧 ${this.name} v${this.version}\n`);
	static #EXTM3URegex = /^(?:(?<TAG>#(?:EXT|AIV)[^#:\s\r\n]+)(?::(?<OPTION>[^\r\n]+))?(?:(?:\r\n|\r|\n)(?<URI>[^#\s\r\n]+))?|(?<NOTE>#[^\r\n]+)?)(?:\r\n|\r|\n)?$/gm;
	static #OPTIONValueRegex = /^((-?\d+[x.\d]+)|[0-9A-Z-]+)$/;

	static parse(m3u8 = new String) {
		console.log(`☑️ ${this.name}, parse EXTM3U`, "");
		/***************** v0.8.2-beta *****************/
		//const EXTM3U_Regex = /^(?:[\s\r\n]{1})|(?:(?<TAG>#(?:EXT|AIV)[^#:\s\r\n]+)|(?<NOTE>#.+))(?::(?<OPTION>.+))?[\s\r\n]?(?<URI>[^#\s\r\n]+)?$/gm;
		//const EXTM3U_Regex = /^(((?<TAG>#(EXT|AIV)[^#:\s\r\n]+)(:(?<OPTION>[^\r\n]+))?([\r\n](?<URI>[^#\s\r\n]+))?)|(?<NOTE>#[^\r\n]+))[\r\n]?$/gm;
		//const EXTM3U_Regex = /^(?:(?<TAG>#(?:EXT|AIV)[^#:\s\r\n]+)(?::(?<OPTION>[^\r\n]+))?(?:[\r\n](?<URI>[^#\s\r\n]+))?|(?<NOTE>#[^\r\n]+)?)[\r\n]?$/gm;
		const EXTM3U_Regex = /^(?:(?<TAG>#(?:EXT|AIV)[^#:\s\r\n]+)(?::(?<OPTION>[^\r\n]+))?(?:(?:\r\n|\r|\n)(?<URI>[^#\s\r\n]+))?|(?<NOTE>#[^\r\n]+)?)(?:\r\n|\r|\n)?$/gm;
		//let array = [...m3u8.matchAll(EXTM3U_Regex)]
		//array.forEach(item => console.log(`🚧 ${this.name}, parse EXTM3U, item.groups: ${JSON.stringify(item?.groups)}`, ""));
		let json = [...m3u8.matchAll(this.#EXTM3URegex)].map(item => {
			item = item?.groups || item;
			//console.log(`🚧 ${this.name}, parse EXTM3U`, `before: item.OPTION.split(/,\s*(?![^"]*",)/) ${JSON.stringify(`${item.OPTION}\,`?.split(/,\s*(?![^"]*",)/) ?? "")}`, "");
			if (/=/.test(item?.OPTION)) item.OPTION = Object.fromEntries(`${item.OPTION}\,`.split(/,\s*(?![^"]*",)/).slice(0, -1).map(option => {
				option = option.split(/=(.*)/);
				option[1] = (isNaN(option[1])) ? option[1].replace(/^"(.*)"$/, "$1") : parseInt(option[1], 10);
				return option;
			}));
			return item
		});
		/***************** v0.7.0-beta *****************/
		//const EXTM3U_Regex = /^(?<TYPE>(?:EXT|AIV)[^#:]+):?(?<OPTION>.+)?[\r\n]?(?<URI>.+)?$/;
		/*
		let json = m3u8.replace(/\r\n/g, "\n").split(/[\r\n]+#/).map(v => v.match(EXTM3U_Regex)?.groups ?? v).map(item => {
			//console.log(`🚧 ${this.name}, parse EXTM3U`, `before: item.OPTION.split(/,\s*(?![^"]*",)/) ${JSON.stringify(`${item.OPTION}\,`?.split(/,\s*(?![^"]*",)/) ?? "")}`, "");
			if (/=/.test(item?.OPTION)) item.OPTION = Object.fromEntries(`${item.OPTION}\,`.split(/,\s*(?![^"]*",)/).slice(0, -1).map(option => {
				option = option.split(/=(.*)/);
				option[1] = (isNaN(option[1])) ? option[1].replace(/^"(.*)"$/, "$1") : parseInt(option[1], 10);
				return option;
			}));
			return item
		});
		*/
		console.log(`✅ ${this.name}, parse WebVTT, json: ${JSON.stringify(json)}`, "");
		return json;
	};

	static stringify(json = new Array, options = { lineBreak: "\n" }) {
		console.log(`☑️ ${this.name}, stringify EXTM3U`, "");
		if (json?.[0]?.TAG !== "#EXTM3U") json.unshift({ "TAG": "#EXTM3U" })
		let m3u8 = json.map(item => {
			console.log(`🚧 ${this.name}, stringify EXTM3U, before: item: ${JSON.stringify(item)}`, "");
			if (typeof item?.OPTION === "object") item.OPTION = Object.entries(item.OPTION).map(option => {
				/*
				switch (item.TYPE) {
					case "EXT-X-SESSION-DATA":
						option[1] = `"${option[1]}"`;
						break;
					case "EXT-X-MEDIA":
					default:
						switch (option[0]) {
							case "INSTREAM-ID":
							case "HDCP-LEVEL":
							case "CHANNELS":
							case "URI":
								option[1] = `"${option[1]}"`;
								break;
							default:
								if (!isNaN(item[1])) {
									if (typeof option[1] === "number") option[1] = option[1];
									else if (typeof option[1] === "string") option[1] = `"${option[1]}"`
								} else if (!OPTION_value_Regex.test(option[1])) option[1] = `"${option[1]}"`;
								break;
						};
						break;
				};
				*/
				if (item?.TAG === "#EXT-X-SESSION-DATA") option[1] = `"${option[1]}"`;
				else if (!isNaN(option[1])) option[1] = (typeof option[1] === "number") ? option[1] : `"${option[1]}"`;
				else if (option[0] === "ID" || option[0] === "INSTREAM-ID" || option[0] === "KEYFORMAT") option[1] = `"${option[1]}"`;
				else if (!this.#OPTIONValueRegex.test(option[1])) option[1] = `"${option[1]}"`;
				return option.join("=");
			}).join(",");
			console.log(`🚧 ${this.name}, stringify EXTM3U, after: item: ${JSON.stringify(item)}`, "");
			return item = (item?.URI) ? item.TAG + ":" + item.OPTION + options.lineBreak + item.URI
				: (item?.OPTION) ? item.TAG + ":" + item.OPTION
					: (item?.TAG) ? item.TAG
						: (item?.NOTE) ? item.NOTE
							: "";
		}).join(options.lineBreak);
		console.log(`✅ ${this.name}, stringify EXTM3U, m3u8: ${m3u8}`, "");
		return m3u8;
	};
};
