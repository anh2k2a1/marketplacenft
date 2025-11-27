import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { mintController } from "./controllers/nftController.ts";
import { ListForSaleController, CancelListingController } from "./controllers/marketController.ts";
dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',  
  credentials: true                
}));
app.use(express.json());


app.post("/api/nft/mint", mintController);
app.post("/api/market/list", ListForSaleController);
app.post("/api/market/cancel", CancelListingController);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Node.js API chạy tại http://localhost:${PORT}`);
  console.log(`Sync data về Java: ${process.env.JAVA_BACKEND_URL}`);
});