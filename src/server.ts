import { app } from "./app";

app.listen({
    host: '0.0.0.0',	
    port: 4000,
}).then(() => {
    console.log('🚀 HTTP server running on http://localhost:4000')
})