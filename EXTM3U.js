// refer: https://datatracker.ietf.org/doc/html/draft-pantos-http-live-streaming-08
export class EXTM3U {
	constructor(opts) {
		this.name = "EXTM3U v0.7.0";
		this.opts = opts;
		this.newLine = (this.opts.includes("\n")) ? "\n" : (this.opts.includes("\r")) ? "\r" : (this.opts.includes("\r\n")) ? "\r\n" : "\n";
	};

	parse(m3u8 = new String) {
		//$.log(`🚧 ${$.name}, parse EXTM3U`, "");
		/***************** v0.7.0-beta *****************/
		const EXTM3U_Regex = /^(?<TYPE>(?:EXT|AIV)[^#:]+):?(?<OPTION>.+)?[\r\n]?(?<URI>.+)?$/;
		let json = m3u8.replace(/\r\n/g, "\n").split(/[\r\n]#/).map(v => v.match(EXTM3U_Regex)?.groups ?? v)
		//$.log(`🚧 ${$.name}, parse EXTM3U`, `json: ${JSON.stringify(json)}`, "");
		json = json.map(item => {
			//$.log(`🚧 ${$.name}, parse EXTM3U`, `before: item.OPTION.split(/,(?=[A-Z])/) ${JSON.stringify(item.OPTION?.split(/,(?=[A-Z])/) ?? "")}`, "");
			if (/=/.test(item?.OPTION) && this.opts.includes(item.TYPE)) item.OPTION = Object.fromEntries(item.OPTION.split(/,(?=[A-Z])/).map(item => item.split(/=(.*)/)));
			return item
		});
		//$.log(`🚧 ${$.name}, parse WebVTT`, `json: ${JSON.stringify(json)}`, "");
		return json
	};

	stringify(json = new Array) {
		//$.log(`🚧 ${$.name}, stringify EXTM3U`, "");
		if (!json?.[0]?.includes("#EXTM3U")) json.unshift("#EXTM3U")
		let m3u8 = json.map(item => {
			if (typeof item?.OPTION == "object") item.OPTION = Object.entries(item.OPTION).map(item => item = item.join("=")).join(",");
			/***************** v0.7.0-beta *****************/
			return item = (item.URI) ? item.TYPE + ":" + item.OPTION + this.newLine + item.URI
				: (item.OPTION) ? item = item.TYPE + ":" + item.OPTION
					: (item.TYPE) ? item = item.TYPE
						: item = item
		})
		m3u8 = m3u8.join(this.newLine + "#")
		//$.log(`🚧 ${$.name}, stringify EXTM3U`, `m3u8: ${m3u8}`, "");
		return m3u8
	};
}
