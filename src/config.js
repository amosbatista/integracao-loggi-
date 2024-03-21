const NodeCache = require('node-cache')

export default {
	"port": 3000,
	"bodyLimit": "1024mb",
	"corsHeaders": ["Link", "auth-token"],
	"cacheLib": new NodeCache(),
}
