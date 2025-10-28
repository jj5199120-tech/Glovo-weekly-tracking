import React, { useState, useMemo, useEffect } from "react";

export default function TennyPennyGlovoTracker() {
  const [orders, setOrders] = useState(() => Number(localStorage.getItem("orders")) || 0);
  const [avgPerOrder, setAvgPerOrder] = useState(() => Number(localStorage.getItem("avgPerOrder")) || 550);
  const [bonuses, setBonuses] = useState(() => Number(localStorage.getItem("bonuses")) || 0);
  const [codCollected, setCodCollected] = useState(() => Number(localStorage.getItem("codCollected")) || 0);
  const [commissionPct, setCommissionPct] = useState(() => Number(localStorage.getItem("commissionPct")) || 0);
  const [taxPct, setTaxPct] = useState(() => Number(localStorage.getItem("taxPct")) || 2);
  const [adminAdjustment, setAdminAdjustment] = useState(() => Number(localStorage.getItem("adminAdjustment")) || 500);
  const [platformFee, setPlatformFee] = useState(() => Number(localStorage.getItem("platformFee")) || 500);
  const [prevNegative, setPrevNegative] = useState(() => Number(localStorage.getItem("prevNegative")) || 0);

  useEffect(() => {
    localStorage.setItem("orders", orders);
    localStorage.setItem("avgPerOrder", avgPerOrder);
    localStorage.setItem("bonuses", bonuses);
    localStorage.setItem("codCollected", codCollected);
    localStorage.setItem("commissionPct", commissionPct);
    localStorage.setItem("taxPct", taxPct);
    localStorage.setItem("adminAdjustment", adminAdjustment);
    localStorage.setItem("platformFee", platformFee);
    localStorage.setItem("prevNegative", prevNegative);
  }, [orders, avgPerOrder, bonuses, codCollected, commissionPct, taxPct, adminAdjustment, platformFee, prevNegative]);

  const results = useMemo(() => {
    const grossFromOrders = orders * avgPerOrder;
    const gross = grossFromOrders + bonuses;
    const commission = (commissionPct / 100) * gross;
    const tax = (taxPct / 100) * gross;
    const totalFixedDeductions = adminAdjustment + platformFee;
    const payoutBeforeCOD = gross - commission - tax - totalFixedDeductions - prevNegative;
    const netPayout = payoutBeforeCOD - codCollected;
    const perOrderNet = orders > 0 ? netPayout / orders : 0;

    return { grossFromOrders, gross, commission, tax, totalFixedDeductions, payoutBeforeCOD, netPayout, perOrderNet };
  }, [orders, avgPerOrder, bonuses, codCollected, commissionPct, taxPct, adminAdjustment, platformFee, prevNegative]);

  return (
    <div className="min-h-screen bg-yellow-50 p-4 sm:p-8">
      <div className="max-w-xl mx-auto">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-green-700">Tenny Penny Glovo Payout Tracker</h1>
          <p className="text-sm text-green-800 mt-1">Track your weekly payout in Glovo style. Auto-saves your last inputs.</p>
        </header>

        <div className="bg-white shadow-lg rounded-2xl p-5 sm:p-6 space-y-4">
          <section className="grid grid-cols-2 gap-3">
            <label>
              <div className="text-xs text-green-700">Orders (count)</div>
              <input type="number" value={orders} onChange={(e) => setOrders(Number(e.target.value))} className="w-full rounded-lg p-2 border border-green-300" />
            </label>

            <label>
              <div className="text-xs text-green-700">Avg per order (₦)</div>
              <input type="number" value={avgPerOrder} onChange={(e) => setAvgPerOrder(Number(e.target.value))} className="w-full rounded-lg p-2 border border-green-300" />
            </label>

            <label className="col-span-2">
              <div className="text-xs text-green-700">Bonuses / Zone boosts (₦)</div>
              <input type="number" value={bonuses} onChange={(e) => setBonuses(Number(e.target.value))} className="w-full rounded-lg p-2 border border-green-300" />
            </label>

            <label>
              <div className="text-xs text-green-700">COD collected (₦)</div>
              <input type="number" value={codCollected} onChange={(e) => setCodCollected(Number(e.target.value))} className="w-full rounded-lg p-2 border border-green-300" />
            </label>

            <label>
              <div className="text-xs text-green-700">Previous negative (₦)</div>
              <input type="number" value={prevNegative} onChange={(e) => setPrevNegative(Number(e.target.value))} className="w-full rounded-lg p-2 border border-green-300" />
            </label>
          </section>

          <section className="grid grid-cols-2 gap-3 border-t pt-4 mt-2">
            <label>
              <div className="text-xs text-green-700">Commission %</div>
              <input type="number" value={commissionPct} onChange={(e) => setCommissionPct(Number(e.target.value))} className="w-full rounded-lg p-2 border border-green-300" />
            </label>

            <label>
              <div className="text-xs text-green-700">Tax %</div>
              <input type="number" value={taxPct} onChange={(e) => setTaxPct(Number(e.target.value))} className="w-full rounded-lg p-2 border border-green-300" />
            </label>

            <label>
              <div className="text-xs text-green-700">Admin adjustment (₦)</div>
              <input type="number" value={adminAdjustment} onChange={(e) => setAdminAdjustment(Number(e.target.value))} className="w-full rounded-lg p-2 border border-green-300" />
            </label>

            <label>
              <div className="text-xs text-green-700">Platform fee (₦)</div>
              <input type="number" value={platformFee} onChange={(e) => setPlatformFee(Number(e.target.value))} className="w-full rounded-lg p-2 border border-green-300" />
            </label>
          </section>

          <section className="pt-4">
            <div className="rounded-xl bg-yellow-100 p-4">
              <div className="flex justify-between text-sm mb-1"><span>Gross from orders</span><span>₦{results.grossFromOrders.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm mb-1"><span>Total gross</span><span>₦{results.gross.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm mb-1"><span>Commission</span><span>₦{results.commission.toFixed(0)}</span></div>
              <div className="flex justify-between text-sm mb-1"><span>Tax ({taxPct}%)</span><span>₦{results.tax.toFixed(0)}</span></div>
              <div className="flex justify-between text-sm mb-1"><span>Fixed deductions</span><span>₦{results.totalFixedDeductions}</span></div>
              <div className="flex justify-between text-sm mb-1"><span>Payout before COD</span><span>₦{results.payoutBeforeCOD.toFixed(0)}</span></div>
              <div className="flex justify-between text-sm mb-1"><span>COD to be reconciled</span><span>₦{codCollected}</span></div>
              <div className="flex justify-between text-lg font-bold text-green-800 border-t mt-2 pt-2"><span>Estimated Net Payout</span><span>₦{results.netPayout.toFixed(0)}</span></div>
              <div className="flex justify-between text-sm text-green-700 mt-1"><span>Avg per order</span><span>₦{results.perOrderNet.toFixed(0)}</span></div>
            </div>
          </section>

          <footer className="mt-4 flex gap-2">
            <button onClick={() => {
              setOrders(25); setAvgPerOrder(550); setBonuses(2000); setCodCollected(10500); setCommissionPct(0); setTaxPct(2); setAdminAdjustment(500); setPlatformFee(500); setPrevNegative(0);
            }} className="flex-1 py-2 rounded-xl bg-green-500 text-white font-medium">Load Example</button>

            <button onClick={() => {
              setOrders(0); setAvgPerOrder(550); setBonuses(0); setCodCollected(0); setCommissionPct(0); setTaxPct(2); setAdminAdjustment(500); setPlatformFee(500); setPrevNegative(0);
              localStorage.clear();
            }} className="flex-1 py-2 rounded-xl bg-green-700 text-white font-medium">Reset</button>
          </footer>
        </div>

        <p className="text-xs text-green-800 mt-3 text-center">Made for you, Tenny Penny 🚴🏾‍♂️ — track your Glovo earnings smart and stress-free.</p>
      </div>
    </div>
  );
}
