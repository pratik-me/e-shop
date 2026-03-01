import express from 'express';
import cors from "cors"
import { errorMiddleware } from '@packages/error-handler/error-middleware';
import cookieParser from 'cookie-parser';
import router from './routes/product.router';

const port = Number(process.env.PORT) || 6002 ;

const app = express();

app.use(cors({
    origin: ["http://localhost:3000"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
}))

app.use(express.json({limit: "100mb"}))
app.use(express.urlencoded({limit: "100mb", extended: true}));
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send({ 'message': 'Hello Product API'});
});

// Routes
app.use("/api", router)

app.use(errorMiddleware);

const server = app.listen(port, () => {
    console.log(`Product service is running at http://localhost:${port}/api`);
});

server.on('error', (err) => {
    console.log("Server error:", err)
});
