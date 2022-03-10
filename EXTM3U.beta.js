// refer: https://datatracker.ietf.org/doc/html/draft-pantos-http-live-streaming-08
function EXTM3U(name, opts) {
	return new (class {
		constructor(name, opts) {
			this.name = name
			Object.assign(this, opts)
		};

		parse(m3u8 = new String, options = []) {
			$.log(`🚧 ${$.name}, parse EXTM3U`, "");
			const headers_EXTM3U_Regex = /^#(?<fileType>EXTM3U)?[^]*/;
			const headers_Option_Regex = /^#(?<Xoptions>EXT[^:]+)$/m;
			const body_Regex = /^(?<XType>EXT.*):(?<Xoptions>.+)[^]?(?<URI>.+)?$/;
            let json = {
				headers: m3u8.match(headers_EXTM3U_Regex)?.groups ?? null,
				option: m3u8.match(headers_Option_Regex)?.groups ?? null,
				body: m3u8.split(/[(\r\n)\r\n]#/).map(item => item = item.match(body_Regex)?.groups ?? "")
			};
			$.log(`🚧 ${$.name}, parse WebVTT`, `json.headers: ${JSON.stringify(json.headers)}`, "");
			$.log(`🚧 ${$.name}, parse WebVTT`, `json.option: ${JSON.stringify(json.option)}`, "");
			$.log(`🚧 ${$.name}, parse WebVTT`, `json.body: ${JSON.stringify(json.body)}`, "");
			return json
		};

		stringify(json = { headers: {}, CSS: {}, body: [] }, options = []) {

			return m3u8
		};
	})(name, opts)
}
