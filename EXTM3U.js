// refer: https://datatracker.ietf.org/doc/html/draft-pantos-http-live-streaming-08
function EXTM3U(name, opts) {
	return new (class {
		constructor(name, opts) {
			this.name = name
			Object.assign(this, opts)
		};

		parse(m3u8 = new String, format = "EXT-X-MEDIA", options = []) {
			const EXTM3U_headers_Regex = /^#(?<fileType>EXTM3U)?[^]*/;
			const EXTM3U_option_Regex = /^#(?<EXT>EXT-X-[^:]+)$/m;
			const EXTM3U_body_Regex = /^(?<EXT>(EXT|AIV)[^:]+):(?<OPTION>.+)([^](?<URI>.+))?/;
			let json = {
				headers: m3u8.match(EXTM3U_headers_Regex)?.groups ?? "",
				option: m3u8.match(EXTM3U_option_Regex)?.groups ?? [],
				body: m3u8.split(/[(\r\n)\r\n]#/).map(item => item = item.match(EXTM3U_body_Regex)?.groups ?? "")
			};
			json.body = json.body.map(item => {
				if (item?.EXT == format) item.OPTION = Object.fromEntries(item.OPTION.split(",").map(item => item.split("=")));
				return item
			});
			return json
		};

		stringify(json = { headers: {}, option: [], body: [] }, format = "EXT-X-MEDIA", options = ["\n"]) {
			const newLine = (options.includes("\n")) ? "\n" : (options.includes("\r")) ? "\r" : (options.includes("\r\n")) ? "\r\n" : "\n";
			let m3u8 = [
				json.headers = "#" + json.headers.fileType,
				json.option = json.option.join(newLine),
				json.body = json.body.map(item => {
					if (item) {
						if (item?.EXT == format) item.OPTION = Object.entries(item.OPTION).map(item => item = item.join("=")).join(",");
						return item = (item.EXT == "EXT-X-STREAM-INF") ? "#" + item.EXT + ":" + item.OPTION + newLine + item.URI
							: "#" + item.EXT + ":" + item.OPTION
					}
				}).join(newLine)
			].join(newLine);
			return m3u8
		};
	})(name, opts)
}
