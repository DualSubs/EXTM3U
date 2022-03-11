// refer: https://datatracker.ietf.org/doc/html/draft-pantos-http-live-streaming-08
// refer: https://datatracker.ietf.org/doc/html/draft-pantos-http-live-streaming-08
function EXTM3U(name, opts) {
	return new (class {
		constructor(name, opts) {
			this.name = name
			Object.assign(this, opts)
		};

		parse(m3u8 = new String, options = []) {
			$.log(`🚧 ${$.name}, parse EXTM3U`, "");
			const EXTM3U_headers_Regex = /^#(?<fileType>EXTM3U)?[^]*/;
			const EXTM3U_option_Regex = /^#(?<Options>EXT[^:]+)$/m;
			const EXTM3U_body_Regex = /^(?<EXT>EXT[^:]+):(?<OPTION>.+)[^]?(?<URI>.+)?$/;
            let json = {
				headers: m3u8.match(EXTM3U_headers_Regex)?.groups ?? null,
				option: m3u8.match(EXTM3U_option_Regex)?.groups ?? null,
				body: m3u8.split(/[(\r\n)\r\n]#/).map(item => item = item.match(EXTM3U_body_Regex)?.groups ?? null)
			};
			$.log(`🚧 ${$.name}, parse WebVTT`, `json.headers: ${JSON.stringify(json.headers)}`, "");
			$.log(`🚧 ${$.name}, parse WebVTT`, `json.option: ${JSON.stringify(json.option)}`, "");
			//$.log(`🚧 ${$.name}, parse WebVTT`, `json.body: ${JSON.stringify(json.body)}`, "");
			json.body = json.body.map(item => {
				if (item?.OPTION) {
					item.OPTION = Object.fromEntries(item.OPTION.replace(/\"/g, "").split(",").map(item => item.split("=")));
					$.log(`🚧 ${$.name}, parse WebVTT`, `item.OPTION ${JSON.stringify(item.OPTION)}`, "");
				}
				$.log(`🚧 ${$.name}, parse WebVTT`, `item ${JSON.stringify(item)}`, "");
				return item
				/*
				if (item?.OPTION) {
					$.log(`🚧 ${$.name}, parse WebVTT`, `item.OPTION: ${item?.OPTION}`, "");
					item.OPTION = item.OPTION.split(",")
					$.log(`🚧 ${$.name}, parse WebVTT`, `item.OPTION.split: ${item?.OPTION}`, "");
					item.OPTION = item.OPTION.map(item => item.replace(/\"/, ""))
					$.log(`🚧 ${$.name}, parse WebVTT`, `item.OPTION.map: ${item?.OPTION}`, "");
					item.OPTION = item.OPTION.map(item => item.split("="))
					$.log(`🚧 ${$.name}, parse WebVTT`, `item.OPTION.map ${item?.OPTION}`, "");
				}
				*/
			});
			$.log(`🚧 ${$.name}, parse WebVTT`, `json.body: ${JSON.stringify(json.body)}`, "");
			return json
		};

		stringify(json = { headers: {}, CSS: {}, body: [] }, options = []) {

			return m3u8
		};
	})(name, opts)
}
