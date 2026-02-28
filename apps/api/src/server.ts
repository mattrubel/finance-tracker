import { createServer } from "node:http";
import { InMemoryTransactionRepository } from "@finance-tracker/data-access";
import { calculateMonthlySpend } from "@finance-tracker/domain";

const repository = new InMemoryTransactionRepository();

const server = createServer(async (req, res) => {
  if (!req.url) {
    res.writeHead(400);
    res.end("Missing URL");
    return;
  }

  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }

  if (req.method === "GET" && req.url === "/analytics/monthly-spend") {
    const transactions = await repository.list();
    const monthlySpend = calculateMonthlySpend(transactions);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ monthlySpend }));
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

const port = Number(process.env.PORT ?? 4000);
server.listen(port, () => {
  // Keep startup log explicit for local DX.
  console.log(`API listening on http://localhost:${port}`);
});
